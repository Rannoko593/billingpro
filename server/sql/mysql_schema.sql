-- WASCO MySQL/XAMPP mirror schema
-- Run this in phpMyAdmin SQL tab. It recreates MySQL mirror tables only.

DROP DATABASE IF EXISTS wasco_logs;
CREATE DATABASE wasco_logs;
USE wasco_logs;

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    address TEXT,
    district VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',
    registration_date DATE DEFAULT (CURRENT_DATE),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customers_account (account_number),
    INDEX idx_customers_email (email),
    INDEX idx_customers_role (role)
);

-- Optional mirror table for your manual checks. Backend also keeps this synced.
CREATE TABLE users LIKE customers;

CREATE TABLE billing_rates (
    rate_id INT AUTO_INCREMENT PRIMARY KEY,
    rate_tier VARCHAR(50) NOT NULL,
    usage_range_start DECIMAL(10,2) NOT NULL,
    usage_range_end DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    effective_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE water_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    reading_date DATE DEFAULT (CURRENT_DATE),
    meter_reading DECIMAL(10,2) NOT NULL,
    previous_reading DECIMAL(10,2) DEFAULT 0,
    consumption DECIMAL(10,2) DEFAULT 0,
    month VARCHAR(20),
    year INT,
    reading_status VARCHAR(20) DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usage_account (account_number),
    INDEX idx_usage_date (reading_date)
);

CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    month VARCHAR(20),
    year INT,
    total_amount_due DECIMAL(10,2) NOT NULL,
    consumption DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    due_date DATE,
    generation_date DATE DEFAULT (CURRENT_DATE),
    paid_date DATE,
    UNIQUE KEY bills_account_month_year_unique (account_number, month, year),
    INDEX idx_bills_account (account_number),
    INDEX idx_bills_status (payment_status)
);

CREATE TABLE payment_history (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    bill_id INT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    card_holder VARCHAR(100),
    transaction_id VARCHAR(100) UNIQUE,
    receipt_number VARCHAR(50),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'completed',
    INDEX idx_payments_account (account_number),
    INDEX idx_payments_bill (bill_id)
);

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type VARCHAR(20),
    user_id VARCHAR(50),
    action VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    details TEXT,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20),
    sender_account_number VARCHAR(50),
    sender_role VARCHAR(50),
    title VARCHAR(100),
    message TEXT,
    type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    INDEX idx_notif_account (account_number),
    INDEX idx_notif_read (is_read)
);

CREATE TABLE leak_reports (
    leak_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20),
    location TEXT,
    description TEXT,
    urgency VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leaks_account (account_number),
    INDEX idx_leaks_status (status)
);

CREATE TABLE payment_history_backup (
    payment_id INT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    bill_id INT NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(30),
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50),
    payment_date DATETIME NULL,
    payment_status VARCHAR(20) DEFAULT 'completed',
    card_holder VARCHAR(100),
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_summary_backup (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    total_bills INT NOT NULL DEFAULT 0,
    total_billed DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    outstanding DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(30),
    period VARCHAR(20),
    generated_by VARCHAR(50),
    file_path VARCHAR(255),
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data JSON NULL
);

INSERT INTO billing_rates (rate_tier, usage_range_start, usage_range_end, cost_per_unit)
VALUES
('Basic', 0, 10, 5.00),
('Medium', 11, 20, 7.50),
('High', 21, 30, 10.00),
('Excessive', 31, 999999, 15.00);
