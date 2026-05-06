const express = require('express');
const cors = require('cors');
require('dotenv').config();

const postgresPool = require('./config/database/postgres');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ensureDatabaseCompatibility = async () => {
  try {
    await postgresPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully');

    await postgresPool.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT`);
    await postgresPool.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS district VARCHAR(50)`);
    await postgresPool.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'`);
    await postgresPool.query(`ALTER TABLE customers ADD COLUMN IF NOT EXISTS role VARCHAR(30) DEFAULT 'customer'`);

    await postgresPool.query(`ALTER TABLE billing_rates ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT CURRENT_DATE`);
    await postgresPool.query(`ALTER TABLE billing_rates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);

    await postgresPool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_account_number VARCHAR(50)`);
    await postgresPool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_role VARCHAR(50)`);
    await postgresPool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP`);

    await postgresPool.query(`ALTER TABLE bills ADD COLUMN IF NOT EXISTS consumption DECIMAL(10,2) DEFAULT 0`);
    await postgresPool.query(`ALTER TABLE bills ADD COLUMN IF NOT EXISTS paid_date DATE`);
    await postgresPool.query(`ALTER TABLE bills ADD COLUMN IF NOT EXISTS generation_date DATE DEFAULT CURRENT_DATE`);

    await postgresPool.query(`ALTER TABLE payment_history ADD COLUMN IF NOT EXISTS card_holder VARCHAR(100)`);

    await postgresPool.query(`
      UPDATE customers SET role = 'customer'
      WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('customer', 'customers', 'user', 'client', 'consumer')
    `);

    await postgresPool.query(`
      UPDATE customers SET role = 'branch_manager'
      WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('branch manager', 'manager', 'branch_manager')
    `);

    await postgresPool.query(`
      UPDATE customers SET role = 'administrator'
      WHERE LOWER(TRIM(COALESCE(role, ''))) IN ('admin', 'administrator')
    `);

    await postgresPool.query(`
      INSERT INTO billing_rates (
        rate_tier,
        usage_range_start,
        usage_range_end,
        cost_per_unit,
        is_active,
        effective_date
      )
      SELECT * FROM (VALUES
        ('Residential Basic', 0::numeric, 10::numeric, 5.00::numeric, true, CURRENT_DATE),
        ('Residential Standard', 11::numeric, 20::numeric, 7.50::numeric, true, CURRENT_DATE),
        ('Residential High Usage', 21::numeric, 30::numeric, 10.00::numeric, true, CURRENT_DATE),
        ('Residential Excessive Usage', 31::numeric, 999999::numeric, 15.00::numeric, true, CURRENT_DATE)
      ) AS v(rate_tier, usage_range_start, usage_range_end, cost_per_unit, is_active, effective_date)
      WHERE NOT EXISTS (SELECT 1 FROM billing_rates)
    `);

    console.log('✅ Database compatibility checks completed');
  } catch (error) {
    console.error('❌ Database compatibility check failed message:', error.message);
    console.error('❌ Database compatibility error code:', error.code);
    console.error('❌ Database compatibility detail:', error.detail);
    console.error('❌ Database compatibility stack:', error.stack);
  }
};

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/usage', require('./routes/usage'));

app.get('/', (req, res) => {
  res.send('WASCO API is running...');
});

app.get('/api/test-postgres', async (req, res) => {
  try {
    const result = await postgresPool.query('SELECT NOW()');

    res.json({
      success: true,
      message: 'PostgreSQL connected successfully',
      time: result.rows[0]
    });
  } catch (error) {
    console.error('❌ PostgreSQL test route error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
});

ensureDatabaseCompatibility().finally(() => {
  app.listen(PORT, () => {
    console.log(`WASCO server running on http://localhost:${PORT}`);
  });
});
