const postgresPool = require('../config/database/postgres');

const mapPayment = (row) => row && ({
  ...row,
  id: row.payment_id,
  amount: Number(row.amount_paid || 0),
  amountPaid: Number(row.amount_paid || 0),
  method: row.payment_method,
  paymentMethod: row.payment_method,
  transactionId: row.transaction_id,
  receiptNumber: row.receipt_number,
  date: row.payment_date ? new Date(row.payment_date).toISOString().split('T')[0] : null,
  paymentDate: row.payment_date,
  status: row.payment_status,
});

class Payment {
  static async create(paymentData) {
    const { accountNumber, billId, amount, paymentMethod, transactionId, receiptNumber } = paymentData;
    const result = await postgresPool.query(
      `INSERT INTO payment_history
       (account_number, bill_id, amount_paid, payment_method, transaction_id, receipt_number, payment_date, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 'completed')
       RETURNING *`,
      [accountNumber, billId, amount, paymentMethod, transactionId, receiptNumber]
    );
    return mapPayment(result.rows[0]);
  }

  static async findByAccountNumber(accountNumber) {
    const result = await postgresPool.query(
      'SELECT * FROM payment_history WHERE account_number = $1 ORDER BY payment_date DESC',
      [accountNumber]
    );
    return result.rows.map(mapPayment);
  }

  static async findById(paymentId) {
    const result = await postgresPool.query('SELECT * FROM payment_history WHERE payment_id = $1', [paymentId]);
    return mapPayment(result.rows[0]);
  }

  static async getAll() {
    const result = await postgresPool.query(
      `SELECT p.*, c.name, c.email
       FROM payment_history p
       LEFT JOIN customers c ON c.account_number = p.account_number
       ORDER BY p.payment_date DESC
       LIMIT 200`
    );
    return result.rows.map(mapPayment);
  }

  static async getTotalRevenue() {
    const result = await postgresPool.query(
      `SELECT COALESCE(SUM(amount_paid), 0) AS total_revenue
       FROM payment_history
       WHERE payment_status = 'completed'`
    );
    return Number(result.rows[0]?.total_revenue || 0);
  }
}

module.exports = Payment;
