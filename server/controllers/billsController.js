const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');
const { findCustomerByAccountNumber } = require('../utils/distributedDb');

const getMyBills = async (req, res) => {
  try {
    const customer = await findCustomerByAccountNumber(req.user.accountNumber);
    if (!customer) return res.json({ success: true, bills: [] });

    if (customer.db_source === 'mysql') {
      const [rows] = await mysqlPool.query(
        `SELECT bill_id, account_number, month, year, consumption, total_amount_due, payment_status, due_date, paid_date, generation_date
         FROM bills WHERE account_number = ? ORDER BY generation_date DESC, bill_id DESC`,
        [req.user.accountNumber]
      );
      return res.json({ success: true, bills: rows.map((b) => ({ ...b, db_source: 'mysql', region_group: 'Highlands' })) });
    }

    const result = await postgresPool.query(
      `SELECT bill_id, account_number, month, year, consumption, total_amount_due, payment_status, due_date, paid_date, generation_date
       FROM bills WHERE account_number = $1 ORDER BY generation_date DESC, bill_id DESC`,
      [req.user.accountNumber]
    );
    res.json({ success: true, bills: result.rows.map((b) => ({ ...b, db_source: 'postgres', region_group: 'Lowlands' })) });
  } catch (error) {
    console.error('Get my bills error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const pg = await postgresPool.query(
      `SELECT b.*, c.name, c.email, c.phone, c.district
       FROM bills b LEFT JOIN customers c ON c.account_number = b.account_number
       ORDER BY b.generation_date DESC, b.bill_id DESC`
    );
    const [my] = await mysqlPool.query(
      `SELECT b.*, c.name, c.email, c.phone, c.district
       FROM bills b LEFT JOIN customers c ON c.account_number = b.account_number
       ORDER BY b.generation_date DESC, b.bill_id DESC`
    );
    res.json({
      success: true,
      bills: [
        ...pg.rows.map((b) => ({ ...b, db_source: 'postgres', region_group: 'Lowlands' })),
        ...my.map((b) => ({ ...b, db_source: 'mysql', region_group: 'Highlands' }))
      ]
    });
  } catch (error) {
    console.error('Get all bills error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyBills, getAllBills };
