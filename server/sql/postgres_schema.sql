-- WASCO PostgreSQL full schema
-- Run this while connected to wasco_main in pgAdmin.

CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    address TEXT,
    district VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'administrator', 'branch_manager')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    registration_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billing_rates (
    rate_id SERIAL PRIMARY KEY,
    rate_tier VARCHAR(50) NOT NULL,
    usage_range_start DECIMAL(10,2) NOT NULL,
    usage_range_end DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS water_usage (
    usage_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL REFERENCES customers(account_number) ON DELETE CASCADE,
    reading_date DATE DEFAULT CURRENT_DATE,
    meter_reading DECIMAL(10,2) NOT NULL,
    previous_reading DECIMAL(10,2) DEFAULT 0,
    consumption DECIMAL(10,2) DEFAULT 0,
    month VARCHAR(20),
    year INTEGER,
    reading_status VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    bill_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL REFERENCES customers(account_number) ON DELETE CASCADE,
    month VARCHAR(20),
    year INTEGER,
    total_amount_due DECIMAL(10,2) NOT NULL,
    consumption DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    generation_date DATE DEFAULT CURRENT_DATE,
    paid_date DATE,
    UNIQUE(account_number, month, year)
);

CREATE TABLE IF NOT EXISTS payment_history (
    payment_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL REFERENCES customers(account_number) ON DELETE CASCADE,
    bill_id INT REFERENCES bills(bill_id) ON DELETE SET NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    receipt_number VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'completed'
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_type VARCHAR(20),
    user_id VARCHAR(50),
    action VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    details TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20),
    title VARCHAR(100),
    message TEXT,
    type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leak_reports (
    leak_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) REFERENCES customers(account_number) ON DELETE SET NULL,
    location TEXT,
    description TEXT,
    urgency VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_account ON customers(account_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_role ON customers(role);
CREATE INDEX IF NOT EXISTS idx_bills_account ON bills(account_number);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(payment_status);
CREATE INDEX IF NOT EXISTS idx_usage_account ON water_usage(account_number);
CREATE INDEX IF NOT EXISTS idx_usage_date ON water_usage(reading_date);
CREATE INDEX IF NOT EXISTS idx_payments_account ON payment_history(account_number);

INSERT INTO billing_rates (rate_tier, usage_range_start, usage_range_end, cost_per_unit)
SELECT * FROM (VALUES
('Basic', 0::numeric, 10::numeric, 5.00::numeric),
('Medium', 11::numeric, 20::numeric, 7.50::numeric),
('High', 21::numeric, 30::numeric, 10.00::numeric),
('Excessive', 31::numeric, 999999::numeric, 15.00::numeric)
) AS v(rate_tier, usage_range_start, usage_range_end, cost_per_unit)
WHERE NOT EXISTS (SELECT 1 FROM billing_rates WHERE billing_rates.rate_tier = v.rate_tier);

CREATE OR REPLACE VIEW customer_balances AS
SELECT
    c.account_number,
    c.name,
    c.email,
    c.role,
    c.district,
    COALESCE(SUM(CASE WHEN b.payment_status <> 'paid' THEN b.total_amount_due ELSE 0 END), 0) AS outstanding_balance,
    COALESCE(SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount_due ELSE 0 END), 0) AS paid_total
FROM customers c
LEFT JOIN bills b ON c.account_number = b.account_number
GROUP BY c.account_number, c.name, c.email, c.role, c.district;

CREATE OR REPLACE VIEW usage_segment_report AS
SELECT
    COALESCE(c.district, 'Unknown') AS district,
    CASE
        WHEN COALESCE(wu.consumption,0) <= 10 THEN 'Low usage'
        WHEN COALESCE(wu.consumption,0) <= 20 THEN 'Medium usage'
        WHEN COALESCE(wu.consumption,0) <= 30 THEN 'High usage'
        ELSE 'Excessive usage'
    END AS segment,
    COUNT(*) AS readings,
    COALESCE(SUM(wu.consumption), 0) AS total_consumption,
    COALESCE(AVG(wu.consumption), 0) AS average_consumption
FROM water_usage wu
JOIN customers c ON c.account_number = wu.account_number
WHERE c.role = 'customer'
GROUP BY COALESCE(c.district, 'Unknown'), segment;
