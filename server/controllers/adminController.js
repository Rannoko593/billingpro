const bcrypt = require('bcryptjs');
const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');
const Customer = require('../models/Customer');
const { mirrorBillingRate, deleteBillingRate: mirrorDeleteBillingRate } = require('../utils/mysqlMirror');

const CUSTOMER_ROLES = ['customer', 'customers', 'user', 'client', 'consumer'];
const MANAGER_ROLES = ['branch_manager', 'branch manager', 'manager'];
const ADMIN_ROLES = ['administrator', 'admin'];
const VALID_ROLES = ['customer', 'branch_manager', 'administrator'];

const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();
  if (CUSTOMER_ROLES.includes(value)) return 'customer';
  if (MANAGER_ROLES.includes(value)) return 'branch_manager';
  if (ADMIN_ROLES.includes(value)) return 'administrator';
  return 'customer';
};

const normalizeRatePayload = (body) => {
  const tierName = body.tierName || body.tier || body.rateTier || body.rate_tier || '';
  const min = body.usageRangeStart ?? body.min ?? body.usage_range_start ?? '';
  const max = body.usageRangeEnd ?? body.max ?? body.usage_range_end ?? '';
  const cost = body.costPerUnit ?? body.rate ?? body.cost_per_unit ?? '';

  return {
    tierName: String(tierName).trim(),
    min,
    max,
    cost,
    isActive: body.isActive ?? body.is_active ?? true
  };
};

const mapRate = (r) => ({
  ...r,
  id: r.rate_id,
  rateId: r.rate_id,
  rateTier: r.rate_tier,
  tier: r.rate_tier,
  tierName: r.rate_tier,
  name: r.rate_tier,
  usageRangeStart: Number(r.usage_range_start || 0),
  usageRangeEnd: Number(r.usage_range_end || 0),
  min: Number(r.usage_range_start || 0),
  max: Number(r.usage_range_end || 0),
  costPerUnit: Number(r.cost_per_unit || 0),
  rate: Number(r.cost_per_unit || 0),
  isActive: r.is_active,
  effectiveDate: r.effective_date
});

const getDashboardStats = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers)::int AS total_users,

        (SELECT COUNT(*)
         FROM customers
         WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('customer', 'customers', 'user', 'client', 'consumer'))::int AS customers,

        (SELECT COUNT(*)
         FROM customers
         WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('branch_manager', 'branch manager', 'manager'))::int AS managers,

        (SELECT COUNT(*)
         FROM customers
         WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('administrator', 'admin'))::int AS administrators,

        (SELECT COALESCE(SUM(total_amount_due), 0)
         FROM bills
         WHERE LOWER(TRIM(COALESCE(payment_status, ''))) IN ('paid', 'completed')) AS paid_revenue,

        (SELECT COUNT(*)
         FROM bills
         WHERE LOWER(TRIM(COALESCE(payment_status, ''))) NOT IN ('paid', 'completed', 'cancelled'))::int AS pending_bills,

        (SELECT COALESCE(SUM(total_amount_due), 0)
         FROM bills
         WHERE LOWER(TRIM(COALESCE(payment_status, ''))) NOT IN ('paid', 'completed', 'cancelled')) AS outstanding,

        (SELECT COUNT(*)
         FROM leak_reports
         WHERE LOWER(TRIM(COALESCE(status, ''))) NOT IN ('resolved', 'completed'))::int AS active_leaks
    `);

    const stats = result.rows[0] || {};
    const totalUsers = Number(stats.total_users || 0);
    const customers = Number(stats.customers || 0);
    const managers = Number(stats.managers || 0);
    const administrators = Number(stats.administrators || 0);
    const paidRevenue = Number(stats.paid_revenue || 0);
    const pendingBills = Number(stats.pending_bills || 0);
    const outstanding = Number(stats.outstanding || 0);
    const activeLeaks = Number(stats.active_leaks || 0);

    res.json({
      success: true,
      stats: {
        total_users: totalUsers,
        totalUsers,
        customers,
        totalCustomers: customers,
        managers,
        branch_managers: managers,
        branchManagers: managers,
        activeManagers: managers,
        administrators,
        admins: administrators,
        paid_revenue: paidRevenue,
        paidRevenue,
        totalRevenue: paidRevenue,
        pending_bills: pendingBills,
        pendingBills,
        outstanding,
        active_leaks: activeLeaks,
        activeLeaks
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Customer.getAll();

    res.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        id: u.customer_id,
        accountNumber: u.account_number,
        regionGroup: u.region_group,
        dbSource: u.db_source
      }))
    });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, email, accountNumber, phone, address, district, role, password } = req.body;

  try {
    if (!name || !email || !accountNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, account number and password are required'
      });
    }

    const finalRole = normalizeRole(role);

    if (await Customer.findByEmail(email) || await Customer.findByAccountNumber(accountNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Email or account number already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Customer.create({
      accountNumber,
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      district,
      role: finalRole
    });

    res.status(201).json({
      success: true,
      message: `User created successfully in ${user.region_group} database`,
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, accountNumber, phone, address, district, role, status } = req.body;

  try {
    const updated = await Customer.update(id, {
      name,
      email,
      account_number: accountNumber,
      phone,
      address,
      district,
      role: normalizeRole(role),
      status: status || 'active'
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User updated successfully in ${updated.region_group} database`,
      user: updated
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Customer.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User deleted from ${deleted.region_group} database` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const finalRole = normalizeRole(role);

    if (!VALID_ROLES.includes(finalRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await Customer.updateRole(id, finalRole);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `Role updated in ${user.region_group} database`, user });
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBillingRates = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT rate_id, rate_tier, usage_range_start, usage_range_end, cost_per_unit, is_active, effective_date
      FROM billing_rates
      ORDER BY usage_range_start ASC, rate_id ASC
    `);

    const rates = result.rows.map(mapRate);

    res.json({
      success: true,
      rates,
      billingRates: rates
    });
  } catch (error) {
    console.error('Rates error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBillingRate = async (req, res) => {
  const { tierName, min, max, cost } = normalizeRatePayload(req.body);

  try {
    if (!tierName || min === '' || max === '' || cost === '') {
      return res.status(400).json({ success: false, message: 'All billing rate fields are required' });
    }

    const result = await postgresPool.query(
      `INSERT INTO billing_rates
       (rate_tier, usage_range_start, usage_range_end, cost_per_unit, is_active, effective_date)
       VALUES ($1,$2,$3,$4,true,CURRENT_DATE)
       RETURNING rate_id, rate_tier, usage_range_start, usage_range_end, cost_per_unit, is_active, effective_date`,
      [tierName, Number(min), Number(max), Number(cost)]
    );

    await mirrorBillingRate(result.rows[0]);
    const rate = mapRate(result.rows[0]);

    res.status(201).json({ success: true, message: 'Billing rate created successfully', rate });
  } catch (error) {
    console.error('Create rate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBillingRate = async (req, res) => {
  const { id } = req.params;
  const { tierName, min, max, cost, isActive } = normalizeRatePayload(req.body);

  try {
    if (!tierName || min === '' || max === '' || cost === '') {
      return res.status(400).json({ success: false, message: 'All billing rate fields are required' });
    }

    const result = await postgresPool.query(
      `UPDATE billing_rates
       SET rate_tier=$1,
           usage_range_start=$2,
           usage_range_end=$3,
           cost_per_unit=$4,
           is_active=$5
       WHERE rate_id=$6
       RETURNING rate_id, rate_tier, usage_range_start, usage_range_end, cost_per_unit, is_active, effective_date`,
      [tierName, Number(min), Number(max), Number(cost), isActive ?? true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Billing rate not found' });
    }

    await mirrorBillingRate(result.rows[0]);
    const rate = mapRate(result.rows[0]);

    res.json({ success: true, message: 'Billing rate updated successfully', rate });
  } catch (error) {
    console.error('Update rate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBillingRate = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await postgresPool.query(
      `DELETE FROM billing_rates WHERE rate_id=$1 RETURNING rate_id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Billing rate not found' });
    }

    await mirrorDeleteBillingRate(id);

    res.json({ success: true, message: 'Billing rate deleted successfully' });
  } catch (error) {
    console.error('Delete rate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT
        p.payment_id,
        p.account_number,
        c.name,
        c.email,
        c.phone,
        c.district,
        p.bill_id,
        p.amount_paid,
        p.payment_method,
        p.transaction_id,
        p.receipt_number,
        p.payment_date,
        p.payment_status,
        b.month,
        b.year
      FROM payment_history p
      LEFT JOIN customers c ON c.account_number = p.account_number
      LEFT JOIN bills b ON b.bill_id = p.bill_id
      ORDER BY p.payment_date DESC
    `);

    res.json({ success: true, payments: result.rows });
  } catch (error) {
    console.error('Payments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDatabaseStatus = async (req, res) => {
  const status = {
    primaryDatabase: 'PostgreSQL',
    secondaryDatabase: 'MySQL / XAMPP Backup & Reporting Fragment',
    primaryStatus: 'Offline',
    secondaryStatus: 'Offline',
    connection: 'Disconnected',
    lastSync: null,
    tables: { customers: 0, bills: 0, payments: 0, waterUsage: 0, billingRates: 0, leakReports: 0, notifications: 0 },
    mysqlTables: { paymentHistoryBackup: 0, billSummaryBackup: 0, notifications: 0, auditLogs: 0, reports: 0 }
  };

  try {
    const pgQueries = await Promise.all([
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM customers`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM bills`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM payment_history`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM water_usage`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM billing_rates`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM leak_reports`),
      postgresPool.query(`SELECT COUNT(*)::int AS count FROM notifications`)
    ]);
    status.primaryStatus = 'Connected';
    status.connection = 'Connected';
    status.tables = {
      customers: pgQueries[0].rows[0].count,
      bills: pgQueries[1].rows[0].count,
      payments: pgQueries[2].rows[0].count,
      waterUsage: pgQueries[3].rows[0].count,
      billingRates: pgQueries[4].rows[0].count,
      leakReports: pgQueries[5].rows[0].count,
      notifications: pgQueries[6].rows[0].count
    };
  } catch (error) {
    status.primaryError = error.message;
  }

  try {
    await mysqlPool.query('SELECT 1');
    const [mysqlCounts] = await mysqlPool.query(`
      SELECT
        (SELECT COUNT(*) FROM payment_history_backup) AS paymentHistoryBackup,
        (SELECT COUNT(*) FROM bill_summary_backup) AS billSummaryBackup,
        (SELECT COUNT(*) FROM notifications) AS notifications,
        (SELECT COUNT(*) FROM audit_logs) AS auditLogs,
        (SELECT COUNT(*) FROM reports) AS reports,
        (SELECT MAX(synced_at) FROM bill_summary_backup) AS lastSync
    `);
    status.secondaryStatus = 'Connected';
    status.mysqlTables = mysqlCounts[0] || status.mysqlTables;
    status.lastSync = mysqlCounts[0]?.lastSync || null;
  } catch (error) {
    status.secondaryError = error.message;
  }

  const httpStatus = status.primaryStatus === 'Connected' || status.secondaryStatus === 'Connected' ? 200 : 500;
  return res.status(httpStatus).json({ success: httpStatus === 200, status });
};

const syncDatabase = async (req, res) => {
  const mysqlConnection = await mysqlPool.getConnection();
  try {
    const payments = await postgresPool.query(`
      SELECT payment_id, account_number, bill_id, amount_paid, payment_method,
             transaction_id, receipt_number, payment_date, payment_status, card_holder
      FROM payment_history
      ORDER BY payment_date DESC
    `);

    const billSummary = await postgresPool.query(`
      SELECT account_number,
             COUNT(*)::int AS total_bills,
             COALESCE(SUM(total_amount_due), 0) AS total_billed,
             COALESCE(SUM(CASE WHEN LOWER(TRIM(COALESCE(payment_status, ''))) IN ('paid', 'completed') THEN total_amount_due ELSE 0 END), 0) AS total_paid,
             COALESCE(SUM(CASE WHEN LOWER(TRIM(COALESCE(payment_status, ''))) NOT IN ('paid', 'completed', 'cancelled') THEN total_amount_due ELSE 0 END), 0) AS outstanding
      FROM bills
      GROUP BY account_number
    `);

    await mysqlConnection.beginTransaction();
    await mysqlConnection.query('TRUNCATE TABLE payment_history_backup');
    await mysqlConnection.query('TRUNCATE TABLE bill_summary_backup');

    for (const p of payments.rows) {
      await mysqlConnection.query(
        `INSERT INTO payment_history_backup
         (payment_id, account_number, bill_id, amount_paid, payment_method, transaction_id, receipt_number, payment_date, payment_status, card_holder, synced_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,NOW())`,
        [p.payment_id, p.account_number, p.bill_id, p.amount_paid, p.payment_method, p.transaction_id, p.receipt_number, p.payment_date, p.payment_status, p.card_holder]
      );
    }

    for (const b of billSummary.rows) {
      await mysqlConnection.query(
        `INSERT INTO bill_summary_backup (account_number, total_bills, total_billed, total_paid, outstanding, synced_at)
         VALUES (?,?,?,?,?,NOW())`,
        [b.account_number, b.total_bills, b.total_billed, b.total_paid, b.outstanding]
      );
    }

    await mysqlConnection.query(
      `INSERT INTO audit_logs (user_type, user_id, action, details)
       VALUES ('administrator', ?, 'SYNC_DATABASE', ?)`,
      [req.user?.accountNumber || req.user?.id || 'admin', 'PostgreSQL data synchronized to MySQL/XAMPP backup fragment']
    );

    await mysqlConnection.commit();
    res.json({ success: true, message: 'PostgreSQL data synchronized to MySQL/XAMPP backup fragment successfully', syncedAt: new Date() });
  } catch (error) {
    await mysqlConnection.rollback();
    console.error('Database sync error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    mysqlConnection.release();
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getBillingRates,
  createBillingRate,
  updateBillingRate,
  deleteBillingRate,
  getAllPayments,
  getDatabaseStatus,
  syncDatabase
};
