const postgresPool = require('../config/database/postgres');
const { mirrorWaterUsage, mirrorBill, mirrorNotification } = require('../utils/mysqlMirror');

const calculateAmount = async (consumption) => {
  const result = await postgresPool.query(
    `SELECT *
     FROM billing_rates
     WHERE $1 BETWEEN usage_range_start AND usage_range_end
       AND is_active = true
     ORDER BY usage_range_start ASC
     LIMIT 1`,
    [consumption]
  );

  if (result.rows.length === 0) {
    return consumption * 5;
  }

  return consumption * Number(result.rows[0].cost_per_unit);
};

const generateBill = async (req, res) => {
  const { accountNumber, month, year, previousReading, currentReading, dueDate } = req.body;

  const client = await postgresPool.connect();

  try {
    if (!accountNumber || !month || !year || previousReading === '' || currentReading === '' || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'All bill fields are required'
      });
    }

    const previous = Number(previousReading);
    const current = Number(currentReading);

    if (current < previous) {
      return res.status(400).json({
        success: false,
        message: 'Current reading cannot be less than previous reading'
      });
    }

    const customer = await client.query(
      `SELECT account_number, name 
       FROM customers 
       WHERE account_number = $1 AND role = 'customer'`,
      [accountNumber]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const existing = await client.query(
      `SELECT bill_id 
       FROM bills 
       WHERE account_number = $1 AND month = $2 AND year = $3`,
      [accountNumber, month, year]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bill already exists for this customer, month and year'
      });
    }

    const consumption = current - previous;
    const amount = await calculateAmount(consumption);

    await client.query('BEGIN');

    const usageResult = await client.query(
      `INSERT INTO water_usage
       (account_number, month, year, previous_reading, meter_reading, consumption, reading_date)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
       RETURNING *`,
      [accountNumber, month, year, previous, current, consumption]
    );

    const billResult = await client.query(
      `INSERT INTO bills
       (account_number, month, year, consumption, total_amount_due, payment_status, due_date, generation_date)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6, CURRENT_DATE)
       RETURNING *`,
      [accountNumber, month, year, consumption, amount, dueDate]
    );

    const notificationResult = await client.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, 'bill_notice', false, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        accountNumber,
        req.user.accountNumber,
        req.user.role,
        `New ${month} ${year} Water Bill`,
        `Your ${month} ${year} bill is M ${Number(amount).toFixed(2)}. Due date: ${dueDate}.`
      ]
    );

    await mirrorWaterUsage(usageResult.rows[0]);
    await mirrorBill(billResult.rows[0]);
    await mirrorNotification(notificationResult.rows[0]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      usage: usageResult.rows[0],
      bill: billResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Generate bill error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  generateBill
};