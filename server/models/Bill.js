const postgresPool = require('../config/database/postgres');

const mapBill = (row) => row && ({
  ...row,
  id: row.bill_id,
  amount: Number(row.total_amount_due || 0),
  totalAmountDue: Number(row.total_amount_due || 0),
  consumption: Number(row.consumption || 0),
  status: row.payment_status,
  dueDate: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : null,
  generationDate: row.generation_date ? new Date(row.generation_date).toISOString().split('T')[0] : null,
});

class Bill {
  static async create(billData) {
    const { accountNumber, month, year, totalAmountDue, dueDate, consumption } = billData;
    const result = await postgresPool.query(
      `INSERT INTO bills (account_number, month, year, total_amount_due, due_date, consumption, payment_status, generation_date)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', CURRENT_DATE)
       ON CONFLICT (account_number, month, year)
       DO UPDATE SET total_amount_due = EXCLUDED.total_amount_due,
                     due_date = EXCLUDED.due_date,
                     consumption = EXCLUDED.consumption,
                     payment_status = 'pending',
                     generation_date = CURRENT_DATE
       RETURNING *`,
      [accountNumber, month, year, totalAmountDue, dueDate, consumption]
    );
    return mapBill(result.rows[0]);
  }

  static async findByAccountNumber(accountNumber) {
    const result = await postgresPool.query(
      'SELECT * FROM bills WHERE account_number = $1 ORDER BY generation_date DESC, bill_id DESC',
      [accountNumber]
    );
    return result.rows.map(mapBill);
  }

  static async findById(billId) {
    const result = await postgresPool.query('SELECT * FROM bills WHERE bill_id = $1', [billId]);
    return mapBill(result.rows[0]);
  }

  static async updateStatus(billId, status) {
    const result = await postgresPool.query(
      `UPDATE bills
       SET payment_status = $1,
           paid_date = CASE WHEN $1 = 'paid' THEN CURRENT_DATE ELSE paid_date END
       WHERE bill_id = $2
       RETURNING *`,
      [status, billId]
    );
    return mapBill(result.rows[0]);
  }

  static async getAll() {
    const result = await postgresPool.query(
      `SELECT b.*, c.name, c.email, c.district
       FROM bills b
       LEFT JOIN customers c ON c.account_number = b.account_number
       ORDER BY b.generation_date DESC, b.bill_id DESC`
    );
    return result.rows.map(mapBill);
  }

  static async getStats() {
    const result = await postgresPool.query(`
      SELECT
        COUNT(*)::int AS total_bills,
        COALESCE(SUM(total_amount_due), 0) AS total_billed,
        COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN total_amount_due ELSE 0 END), 0) AS pending_amount,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount_due ELSE 0 END), 0) AS paid_amount,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END)::int AS pending_count
      FROM bills
    `);
    return result.rows[0];
  }
}

module.exports = Bill;
