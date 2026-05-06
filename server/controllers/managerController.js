const postgresPool = require('../config/database/postgres');

const CUSTOMER_ROLE_SQL = "LOWER(TRIM(COALESCE(role, ''))) IN ('customer', 'customers', 'user', 'client', 'consumer')";
const PAID_SQL = "LOWER(TRIM(COALESCE(payment_status, ''))) IN ('paid', 'completed')";

const getManagerStats = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers WHERE ${CUSTOMER_ROLE_SQL})::int AS total_customers,
        (SELECT COALESCE(SUM(consumption), 0) FROM water_usage) AS total_usage,
        (SELECT COALESCE(SUM(total_amount_due), 0) FROM bills) AS total_billed,
        (SELECT COALESCE(SUM(total_amount_due), 0) FROM bills WHERE ${PAID_SQL}) AS total_paid,
        (SELECT COALESCE(SUM(total_amount_due), 0) FROM bills WHERE NOT (${PAID_SQL})) AS outstanding,
        (SELECT COUNT(*) FROM leak_reports WHERE LOWER(TRIM(COALESCE(status, ''))) NOT IN ('resolved', 'completed'))::int AS active_leaks
    `);

    const row = result.rows[0] || {};

    res.json({
      success: true,
      stats: {
        totalCustomers: Number(row.total_customers || 0),
        totalUsage: Number(row.total_usage || 0),
        totalBilled: Number(row.total_billed || 0),
        totalPaid: Number(row.total_paid || 0),
        outstanding: Number(row.outstanding || 0),
        activeLeaks: Number(row.active_leaks || 0)
      }
    });
  } catch (error) {
    console.error('Manager stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT
        c.customer_id,
        c.account_number,
        c.name,
        c.email,
        c.phone,
        c.address,
        c.district,
        c.status,
        COALESCE(SUM(wu.consumption), 0) AS total_consumption,
        COALESCE(SUM(CASE WHEN NOT (${PAID_SQL.replace(/payment_status/g, 'b.payment_status')}) THEN b.total_amount_due ELSE 0 END), 0) AS outstanding_balance
      FROM customers c
      LEFT JOIN water_usage wu ON wu.account_number = c.account_number
      LEFT JOIN bills b ON b.account_number = c.account_number
      WHERE ${CUSTOMER_ROLE_SQL.replace(/role/g, 'c.role')}
      GROUP BY c.customer_id
      ORDER BY c.name ASC
    `);

    res.json({
      success: true,
      customers: result.rows.map((c) => ({
        id: c.customer_id,
        accountNumber: c.account_number,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        district: c.district,
        status: c.status,
        totalConsumption: Number(c.total_consumption || 0),
        outstandingBalance: Number(c.outstanding_balance || 0)
      }))
    });
  } catch (error) {
    console.error('Manager customers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInterval = (period) => {
  const intervals = {
    daily: '1 day',
    weekly: '7 days',
    monthly: '1 month',
    quarterly: '3 months',
    yearly: '1 year'
  };
  return intervals[period];
};

const generateFlexibleReport = async (req, res) => {
  const { scope = 'single', accountNumber, district, period = 'monthly' } = req.query;
  const interval = getInterval(period);

  try {
    if (!interval) {
      return res.status(400).json({ success: false, message: 'Invalid report period' });
    }

    let filter = '';
    const params = [interval];

    if (scope === 'single') {
      if (!accountNumber) {
        return res.status(400).json({ success: false, message: 'Customer account number is required' });
      }
      params.push(accountNumber);
      filter = `AND c.account_number = $2`;
    }

    if (scope === 'district') {
      if (!district) {
        return res.status(400).json({ success: false, message: 'District is required' });
      }
      params.push(district);
      filter = `AND LOWER(TRIM(COALESCE(c.district, ''))) = LOWER(TRIM($2))`;
    }

    const summary = await postgresPool.query(
      `
      SELECT
        COUNT(DISTINCT c.account_number)::int AS customers,
        COALESCE(SUM(wu.consumption), 0) AS total_usage,
        COALESCE(AVG(wu.consumption), 0) AS average_usage,
        COUNT(DISTINCT b.bill_id)::int AS total_bills,
        COALESCE(SUM(b.total_amount_due), 0) AS total_billed,
        COALESCE(SUM(CASE WHEN ${PAID_SQL.replace(/payment_status/g, 'b.payment_status')} THEN b.total_amount_due ELSE 0 END), 0) AS total_paid,
        COALESCE(SUM(CASE WHEN NOT (${PAID_SQL.replace(/payment_status/g, 'b.payment_status')}) THEN b.total_amount_due ELSE 0 END), 0) AS outstanding
      FROM customers c
      LEFT JOIN water_usage wu
        ON wu.account_number = c.account_number
       AND wu.reading_date >= CURRENT_DATE - $1::interval
      LEFT JOIN bills b
        ON b.account_number = c.account_number
       AND b.generation_date >= CURRENT_DATE - $1::interval
      WHERE ${CUSTOMER_ROLE_SQL.replace(/role/g, 'c.role')}
      ${filter}
      `,
      params
    );

    const s = summary.rows[0] || {};
    const totalBilled = Number(s.total_billed || 0);
    const totalPaid = Number(s.total_paid || 0);

    res.json({
      success: true,
      report: {
        scope,
        period,
        accountNumber: accountNumber || null,
        district: district || null,
        customers: Number(s.customers || 0),
        totalUsage: Number(s.total_usage || 0),
        averageUsage: Number(s.average_usage || 0),
        totalBills: Number(s.total_bills || 0),
        totalBilled,
        totalPaid,
        outstanding: Number(s.outstanding || 0),
        collectionRate: totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : '0.0'
      }
    });
  } catch (error) {
    console.error('Generate flexible report error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateReport = async (req, res) => {
  req.query.scope = 'single';
  req.query.period = req.params.period;
  return generateFlexibleReport(req, res);
};

const sendNotification = async (req, res) => {
  const { accountNumber, target, title, message, type } = req.body;
  const finalTarget = target || accountNumber || 'ALL_CUSTOMERS';

  try {
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notificationController = require('./notificationController');
    req.body = {
      target: finalTarget,
      title,
      message,
      type: type || 'manager_notice'
    };
    return notificationController.sendNotification(req, res);
  } catch (error) {
    console.error('Send manager notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 100
    `);

    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('Get manager notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getManagerStats,
  getCustomers,
  generateReport,
  generateFlexibleReport,
  sendNotification,
  getNotifications
};
