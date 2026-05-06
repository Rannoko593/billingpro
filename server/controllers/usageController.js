const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');
const { findCustomerByAccountNumber } = require('../utils/distributedDb');

const getMyUsageSummary = async (req, res) => {
  try {
    const accountNumber = req.user.accountNumber;
    const customer = await findCustomerByAccountNumber(accountNumber);
    if (!customer) return res.json({ success: true, usage: { latest: null, totalConsumption: 0, averageConsumption: 0, totalRecords: 0, outstanding: 0, paid: 0, pendingBills: 0, paidBills: 0 } });

    if (customer.db_source === 'mysql') {
      const [latest] = await mysqlPool.query(
        `SELECT wu.*, b.total_amount_due, b.payment_status FROM water_usage wu
         LEFT JOIN bills b ON b.account_number=wu.account_number AND b.month=wu.month AND b.year=wu.year
         WHERE wu.account_number=? ORDER BY wu.year DESC, wu.usage_id DESC LIMIT 1`, [accountNumber]
      );
      const [[totals]] = await mysqlPool.query(`SELECT COALESCE(SUM(consumption),0) total_consumption, COALESCE(AVG(consumption),0) average_consumption, COUNT(*) total_records FROM water_usage WHERE account_number=?`, [accountNumber]);
      const [[bills]] = await mysqlPool.query(`SELECT COALESCE(SUM(CASE WHEN payment_status <> 'paid' THEN total_amount_due ELSE 0 END),0) outstanding, COALESCE(SUM(CASE WHEN payment_status='paid' THEN total_amount_due ELSE 0 END),0) paid, COUNT(CASE WHEN payment_status <> 'paid' THEN 1 END) pending_bills, COUNT(CASE WHEN payment_status='paid' THEN 1 END) paid_bills FROM bills WHERE account_number=?`, [accountNumber]);
      return res.json({ success: true, usage: { latest: latest[0] || null, totalConsumption: Number(totals.total_consumption || 0), averageConsumption: Number(totals.average_consumption || 0), totalRecords: Number(totals.total_records || 0), outstanding: Number(bills.outstanding || 0), paid: Number(bills.paid || 0), pendingBills: Number(bills.pending_bills || 0), paidBills: Number(bills.paid_bills || 0) } });
    }

    const latestUsage = await postgresPool.query(`SELECT wu.*, b.total_amount_due, b.payment_status FROM water_usage wu LEFT JOIN bills b ON b.account_number=wu.account_number AND b.month=wu.month AND b.year=wu.year WHERE wu.account_number=$1 ORDER BY wu.year DESC, wu.usage_id DESC LIMIT 1`, [accountNumber]);
    const totals = await postgresPool.query(`SELECT COALESCE(SUM(consumption),0) AS total_consumption, COALESCE(AVG(consumption),0) AS average_consumption, COUNT(*)::int AS total_records FROM water_usage WHERE account_number=$1`, [accountNumber]);
    const bills = await postgresPool.query(`SELECT COALESCE(SUM(CASE WHEN payment_status <> 'paid' THEN total_amount_due ELSE 0 END),0) AS outstanding, COALESCE(SUM(CASE WHEN payment_status='paid' THEN total_amount_due ELSE 0 END),0) AS paid, COUNT(CASE WHEN payment_status <> 'paid' THEN 1 END)::int AS pending_bills, COUNT(CASE WHEN payment_status='paid' THEN 1 END)::int AS paid_bills FROM bills WHERE account_number=$1`, [accountNumber]);
    res.json({ success: true, usage: { latest: latestUsage.rows[0] || null, totalConsumption: Number(totals.rows[0].total_consumption || 0), averageConsumption: Number(totals.rows[0].average_consumption || 0), totalRecords: Number(totals.rows[0].total_records || 0), outstanding: Number(bills.rows[0].outstanding || 0), paid: Number(bills.rows[0].paid || 0), pendingBills: Number(bills.rows[0].pending_bills || 0), paidBills: Number(bills.rows[0].paid_bills || 0) } });
  } catch (error) {
    console.error('Get usage summary error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const mapUsage = (u) => ({ id: u.usage_id, usageId: u.usage_id, billId: u.bill_id, accountNumber: u.account_number, month: u.month, year: u.year, previousReading: Number(u.previous_reading || 0), meterReading: Number(u.meter_reading || 0), currentReading: Number(u.meter_reading || 0), consumption: Number(u.consumption || 0), amountCharged: Number(u.total_amount_due || 0), totalAmountDue: Number(u.total_amount_due || 0), paymentStatus: u.payment_status || 'pending', dueDate: u.due_date, readingDate: u.reading_date });

const getMyUsageHistory = async (req, res) => {
  try {
    const accountNumber = req.user.accountNumber;
    const customer = await findCustomerByAccountNumber(accountNumber);
    if (!customer) return res.json({ success: true, usage: [] });
    const sql = `SELECT wu.usage_id, wu.account_number, wu.month, wu.year, wu.previous_reading, wu.meter_reading, wu.consumption, wu.reading_date, b.bill_id, b.total_amount_due, b.payment_status, b.due_date FROM water_usage wu LEFT JOIN bills b ON b.account_number=wu.account_number AND b.month=wu.month AND b.year=wu.year WHERE wu.account_number = ${customer.db_source === 'mysql' ? '?' : '$1'} ORDER BY wu.year DESC, wu.usage_id DESC`;
    if (customer.db_source === 'mysql') {
      const [rows] = await mysqlPool.query(sql, [accountNumber]);
      return res.json({ success: true, usage: rows.map(mapUsage) });
    }
    const result = await postgresPool.query(sql, [accountNumber]);
    res.json({ success: true, usage: result.rows.map(mapUsage) });
  } catch (error) {
    console.error('Get usage history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyUsageSummary, getMyUsageHistory };
