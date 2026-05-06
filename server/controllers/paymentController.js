const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');
const { findCustomerByAccountNumber } = require('../utils/distributedDb');

const makeReceiptNumber = () => `WASCO-RCP-${Date.now()}`;
const makeTransactionId = () => `WASCO-TXN-${Date.now()}`;

const getPaypalBaseUrl = () => {
  return (process.env.PAYPAL_MODE || 'sandbox').toLowerCase() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

const getPaypalAccessToken = async () => {
  const axios = require('axios');
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to server/.env');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await axios.post(
    `${getPaypalBaseUrl()}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
};

const getPaypalAmount = (bill) => {
  const exchangeRate = Number(process.env.PAYPAL_EXCHANGE_RATE || 1);
  const amount = Number(bill.total_amount_due || 0) * exchangeRate;
  return amount.toFixed(2);
};

const getPaypalConfig = async (req, res) => {
  res.json({
    success: true,
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    currency: process.env.PAYPAL_CURRENCY || 'USD',
    mode: process.env.PAYPAL_MODE || 'sandbox'
  });
};

const findPayableBill = async (billId, user) => {
  const customer = await findCustomerByAccountNumber(user.accountNumber);
  const source = customer?.db_source || 'postgres';

  let bill;
  if (source === 'mysql') {
    const [rows] = await mysqlPool.query(`SELECT * FROM bills WHERE bill_id = ?`, [billId]);
    bill = rows[0];
  } else {
    const result = await postgresPool.query(`SELECT * FROM bills WHERE bill_id = $1`, [billId]);
    bill = result.rows[0];
  }

  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }

  bill.db_source = source;

  if (user.role === 'customer' && bill.account_number !== user.accountNumber) {
    const error = new Error('You can only pay your own bill');
    error.statusCode = 403;
    throw error;
  }

  if (bill.payment_status === 'paid') {
    const error = new Error('This bill is already paid');
    error.statusCode = 400;
    throw error;
  }

  return bill;
};

const completeBillPayment = async ({ bill, user, paymentMethod, cardHolder, transactionId }) => {
  const amount = Number(bill.total_amount_due || 0);
  const receiptNumber = makeReceiptNumber();

  if (bill.db_source === 'mysql') {
    const conn = await mysqlPool.getConnection();
    try {
      await conn.beginTransaction();
      const [payInsert] = await conn.query(
        `INSERT INTO payment_history (account_number, bill_id, amount_paid, payment_method, card_holder, transaction_id, receipt_number, payment_date, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'completed')`,
        [bill.account_number, bill.bill_id, amount, paymentMethod, cardHolder || null, transactionId || makeTransactionId(), receiptNumber]
      );
      await conn.query(`UPDATE bills SET payment_status='paid', paid_date=CURRENT_DATE WHERE bill_id=?`, [bill.bill_id]);
      await conn.query(
        `INSERT INTO notifications (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, 'payment_notice', false, CURRENT_TIMESTAMP)`,
        [bill.account_number, user.accountNumber, user.role, 'Payment Successful', `Your payment of M ${amount.toFixed(2)} for bill #${bill.bill_id} was successful. Receipt: ${receiptNumber}`]
      );
      await conn.commit();
      const [[payment]] = await conn.query('SELECT * FROM payment_history WHERE payment_id=?', [payInsert.insertId]);
      const [[updatedBill]] = await conn.query('SELECT * FROM bills WHERE bill_id=?', [bill.bill_id]);
      return { payment, bill: updatedBill, transactionId: payment.transaction_id, receiptNumber };
    } catch (e) {
      await conn.rollback().catch(() => {});
      throw e;
    } finally {
      conn.release();
    }
  }

  const client = await postgresPool.connect();
  try {
    await client.query('BEGIN');
    const paymentResult = await client.query(
      `INSERT INTO payment_history (account_number, bill_id, amount_paid, payment_method, card_holder, transaction_id, receipt_number, payment_date, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 'completed') RETURNING *`,
      [bill.account_number, bill.bill_id, amount, paymentMethod, cardHolder || null, transactionId || makeTransactionId(), receiptNumber]
    );
    const updatedBill = await client.query(`UPDATE bills SET payment_status='paid', paid_date=CURRENT_DATE WHERE bill_id=$1 RETURNING *`, [bill.bill_id]);
    await client.query(
      `INSERT INTO notifications (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, 'payment_notice', false, CURRENT_TIMESTAMP)`,
      [bill.account_number, user.accountNumber, user.role, 'Payment Successful', `Your payment of M ${amount.toFixed(2)} for bill #${bill.bill_id} was successful. Receipt: ${receiptNumber}`]
    );
    await client.query('COMMIT');
    return { payment: paymentResult.rows[0], bill: updatedBill.rows[0], transactionId: paymentResult.rows[0].transaction_id, receiptNumber };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
};

const createPayPalOrder = async (req, res) => {
  const { billId } = req.body;
  try {
    if (!billId) {
      return res.status(400).json({ success: false, message: 'Bill ID is required' });
    }

    const bill = await findPayableBill(billId, req.user);
    const accessToken = await getPaypalAccessToken();
    const axios = require('axios');
    const currency = process.env.PAYPAL_CURRENCY || 'USD';

    const response = await axios.post(
      `${getPaypalBaseUrl()}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: String(bill.bill_id),
            description: `WASCO water bill #${bill.bill_id}`,
            amount: {
              currency_code: currency,
              value: getPaypalAmount(bill)
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ success: true, id: response.data.id, order: response.data });
  } catch (error) {
    console.error('PayPal create order error:', error.response?.data || error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

const capturePayPalOrder = async (req, res) => {
  const { orderID, billId } = req.body;
  try {
    if (!orderID || !billId) {
      return res.status(400).json({ success: false, message: 'PayPal order ID and bill ID are required' });
    }

    const accessToken = await getPaypalAccessToken();
    const axios = require('axios');

    const captureResponse = await axios.post(
      `${getPaypalBaseUrl()}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (captureResponse.data.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'PayPal payment was not completed' });
    }

    const captureId = captureResponse.data.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderID;

    await client.query('BEGIN');
    const bill = await findPayableBill(billId, req.user);
    const completed = await completeBillPayment({
      client,
      bill,
      user: req.user,
      paymentMethod: 'PayPal',
      cardHolder: null,
      transactionId: captureId
    });

    res.json({
      success: true,
      message: 'PayPal payment completed successfully',
      paypal: captureResponse.data,
      ...completed
    });
  } catch (error) {
    console.error('PayPal capture error:', error.response?.data || error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

const payBill = async (req, res) => {
  const { billId, paymentMethod = 'Card', cardHolder } = req.body;

  try {
    if (!billId) {
      return res.status(400).json({ success: false, message: 'Bill ID is required' });
    }

    const bill = await findPayableBill(billId, req.user);
    const completed = await completeBillPayment({
      bill,
      user: req.user,
      paymentMethod,
      cardHolder,
      transactionId: makeTransactionId()
    });

    res.json({ success: true, message: 'Payment completed successfully', ...completed });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getMyPaymentHistory = async (req, res) => {
  try {
    const customer = await findCustomerByAccountNumber(req.user.accountNumber);
    const source = customer?.db_source || 'postgres';
    let rows;
    if (source === 'mysql') {
      const [r] = await mysqlPool.query(
        `SELECT p.*, b.month, b.year FROM payment_history p LEFT JOIN bills b ON b.bill_id = p.bill_id WHERE p.account_number = ? ORDER BY p.payment_date DESC`,
        [req.user.accountNumber]
      );
      rows = r;
    } else {
      const result = await postgresPool.query(
        `SELECT p.*, b.month, b.year FROM payment_history p LEFT JOIN bills b ON b.bill_id = p.bill_id WHERE p.account_number = $1 ORDER BY p.payment_date DESC`,
        [req.user.accountNumber]
      );
      rows = result.rows;
    }

    res.json({
      success: true,
      payments: rows.map((p) => ({
        id: p.payment_id,
        paymentId: p.payment_id,
        accountNumber: p.account_number,
        billId: p.bill_id,
        amountPaid: Number(p.amount_paid || 0),
        paymentMethod: p.payment_method,
        cardHolder: p.card_holder,
        transactionId: p.transaction_id,
        receiptNumber: p.receipt_number,
        paymentDate: p.payment_date,
        status: p.payment_status,
        month: p.month,
        year: p.year,
        dbSource: source
      }))
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await postgresPool.query(
      `SELECT *
       FROM payment_history
       WHERE payment_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    const payment = result.rows[0];

    if (req.user.role === 'customer' && payment.account_number !== req.user.accountNumber) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const receipt = `
WASCO PAYMENT RECEIPT
-------------------------
Receipt Number: ${payment.receipt_number}
Transaction ID: ${payment.transaction_id}
Account Number: ${payment.account_number}
Bill ID: ${payment.bill_id}
Amount Paid: M ${payment.amount_paid}
Payment Method: ${payment.payment_method}
Payment Status: ${payment.payment_status}
Payment Date: ${payment.payment_date}
-------------------------
Thank you for your payment.
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment.payment_id}.txt`);
    res.send(receipt);
  } catch (error) {
    console.error('Receipt error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPaypalConfig,
  createPayPalOrder,
  capturePayPalOrder,
  payBill,
  getMyPaymentHistory,
  getReceipt
};