const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');
const { findCustomerByAccountNumber } = require('../utils/distributedDb');

const calculateAmount = async (consumption, source = 'postgres') => {
  if (source === 'mysql') {
    const [rows] = await mysqlPool.query(
      `SELECT cost_per_unit FROM billing_rates
       WHERE ? >= usage_range_start AND ? <= usage_range_end AND COALESCE(is_active, true) = true
       ORDER BY usage_range_start ASC LIMIT 1`,
      [consumption, consumption]
    );
    return rows.length ? consumption * Number(rows[0].cost_per_unit || 0) : consumption * 5;
  }

  const result = await postgresPool.query(
    `SELECT cost_per_unit
     FROM billing_rates
     WHERE $1 >= usage_range_start
       AND $1 <= usage_range_end
       AND COALESCE(is_active, true) = true
     ORDER BY usage_range_start ASC
     LIMIT 1`,
    [consumption]
  );
  return result.rows.length ? consumption * Number(result.rows[0].cost_per_unit || 0) : consumption * 5;
};

const generateBillPostgres = async ({ accountNumber, month, year, previous, current, consumption, amount, dueDate, req }) => {
  const client = await postgresPool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT bill_id FROM bills WHERE account_number=$1 AND month=$2 AND year=$3`, [accountNumber, month, Number(year)]);
    if (existing.rows.length > 0) throw new Error('Bill already exists for this customer, month and year');

    const usageResult = await client.query(
      `INSERT INTO water_usage (account_number, month, year, previous_reading, meter_reading, consumption, reading_date)
       VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE) RETURNING *`,
      [accountNumber, month, Number(year), previous, current, consumption]
    );
    const billResult = await client.query(
      `INSERT INTO bills (account_number, month, year, consumption, total_amount_due, payment_status, due_date, generation_date)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,CURRENT_DATE) RETURNING *`,
      [accountNumber, month, Number(year), consumption, Number(amount.toFixed(2)), dueDate]
    );
    await client.query(
      `INSERT INTO notifications (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       VALUES ($1,$2,$3,$4,$5,'bill_notice',false,CURRENT_TIMESTAMP)`,
      [accountNumber, req.user.accountNumber || 'SYSTEM', req.user.role || 'system', `New ${month} ${year} Water Bill`, `Your ${month} ${year} water bill is M ${Number(amount).toFixed(2)}. Due date: ${dueDate}.`]
    );
    await client.query('COMMIT');
    return { usage: usageResult.rows[0], bill: billResult.rows[0] };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
};

const generateBillMysql = async ({ accountNumber, month, year, previous, current, consumption, amount, dueDate, req }) => {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.beginTransaction();
    const [existing] = await conn.query(`SELECT bill_id FROM bills WHERE account_number=? AND month=? AND year=?`, [accountNumber, month, Number(year)]);
    if (existing.length > 0) throw new Error('Bill already exists for this customer, month and year');

    const [usageInsert] = await conn.query(
      `INSERT INTO water_usage (account_number, month, year, previous_reading, meter_reading, consumption, reading_date)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
      [accountNumber, month, Number(year), previous, current, consumption]
    );
    const [billInsert] = await conn.query(
      `INSERT INTO bills (account_number, month, year, consumption, total_amount_due, payment_status, due_date, generation_date)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, CURRENT_DATE)`,
      [accountNumber, month, Number(year), consumption, Number(amount.toFixed(2)), dueDate]
    );
    await conn.query(
      `INSERT INTO notifications (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, 'bill_notice', false, CURRENT_TIMESTAMP)`,
      [accountNumber, req.user.accountNumber || 'SYSTEM', req.user.role || 'system', `New ${month} ${year} Water Bill`, `Your ${month} ${year} water bill is M ${Number(amount).toFixed(2)}. Due date: ${dueDate}.`]
    );
    await conn.commit();
    const [[usage]] = await conn.query('SELECT * FROM water_usage WHERE usage_id=?', [usageInsert.insertId]);
    const [[bill]] = await conn.query('SELECT * FROM bills WHERE bill_id=?', [billInsert.insertId]);
    return { usage, bill };
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
};

const generateBill = async (req, res) => {
  const { accountNumber, month, year, previousReading, currentReading, dueDate } = req.body;

  try {
    if (!accountNumber || !month || !year || previousReading === '' || currentReading === '' || !dueDate) {
      return res.status(400).json({ success: false, message: 'All bill fields are required' });
    }

    const previous = Number(previousReading);
    const current = Number(currentReading);
    if (Number.isNaN(previous) || Number.isNaN(current)) return res.status(400).json({ success: false, message: 'Meter readings must be valid numbers' });
    if (current < previous) return res.status(400).json({ success: false, message: 'Current reading cannot be less than previous reading' });

    const customer = await findCustomerByAccountNumber(accountNumber);
    if (!customer || String(customer.role || '').toLowerCase() !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found or selected user is not a customer' });
    }

    const consumption = current - previous;
    const amount = await calculateAmount(consumption, customer.db_source);
    const payload = { accountNumber, month, year, previous, current, consumption, amount, dueDate, req };
    const result = customer.db_source === 'mysql' ? await generateBillMysql(payload) : await generateBillPostgres(payload);

    res.status(201).json({
      success: true,
      message: `Bill generated successfully in ${customer.region_group} database`,
      dbSource: customer.db_source,
      ...result
    });
  } catch (error) {
    console.error('Generate bill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateBill };
