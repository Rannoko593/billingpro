const mysqlPool = require('../config/database/mysql');

const toMysqlDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace('T', ' ');
  return value;
};

const run = async (sql, values) => {
  await mysqlPool.query(sql, values);
};

const mirrorCustomer = async (customer, password = null) => {
  if (!customer) return;
  const values = [
    customer.customer_id,
    customer.account_number,
    customer.name,
    customer.email,
    customer.phone || null,
    password || customer.password || null,
    customer.address || null,
    customer.district || null,
    customer.role || 'customer',
    customer.status || 'active',
    toMysqlDate(customer.registration_date),
    toMysqlDate(customer.created_at)
  ];

  const sql = `
    INSERT INTO customers
      (customer_id, account_number, name, email, phone, password, address, district, role, status, registration_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), COALESCE(?, CURRENT_TIMESTAMP))
    ON DUPLICATE KEY UPDATE
      account_number = VALUES(account_number),
      name = VALUES(name),
      email = VALUES(email),
      phone = VALUES(phone),
      password = COALESCE(VALUES(password), password),
      address = VALUES(address),
      district = VALUES(district),
      role = VALUES(role),
      status = VALUES(status),
      registration_date = VALUES(registration_date)
  `;

  await run(sql, values);

  // Keep the optional MySQL users mirror table in step with customers too.
  await run(sql.replace('INSERT INTO customers', 'INSERT INTO users'), values);
};

const deleteCustomer = async (customerId) => {
  await run('DELETE FROM customers WHERE customer_id = ?', [customerId]);
  await run('DELETE FROM users WHERE customer_id = ?', [customerId]);
};

const mirrorBillingRate = async (rate) => {
  if (!rate) return;
  await run(
    `INSERT INTO billing_rates
      (rate_id, rate_tier, usage_range_start, usage_range_end, cost_per_unit, effective_date, is_active)
     VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), ?)
     ON DUPLICATE KEY UPDATE
      rate_tier = VALUES(rate_tier),
      usage_range_start = VALUES(usage_range_start),
      usage_range_end = VALUES(usage_range_end),
      cost_per_unit = VALUES(cost_per_unit),
      effective_date = VALUES(effective_date),
      is_active = VALUES(is_active)`,
    [rate.rate_id, rate.rate_tier, rate.usage_range_start, rate.usage_range_end, rate.cost_per_unit, toMysqlDate(rate.effective_date), !!rate.is_active]
  );
};

const deleteBillingRate = async (rateId) => {
  await run('DELETE FROM billing_rates WHERE rate_id = ?', [rateId]);
};

const mirrorWaterUsage = async (u) => {
  if (!u) return;
  await run(
    `INSERT INTO water_usage
      (usage_id, account_number, reading_date, meter_reading, previous_reading, consumption, month, year, reading_status, created_at)
     VALUES (?, ?, COALESCE(?, CURRENT_DATE), ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
     ON DUPLICATE KEY UPDATE
      account_number=VALUES(account_number), reading_date=VALUES(reading_date), meter_reading=VALUES(meter_reading),
      previous_reading=VALUES(previous_reading), consumption=VALUES(consumption), month=VALUES(month), year=VALUES(year),
      reading_status=VALUES(reading_status)`,
    [u.usage_id, u.account_number, toMysqlDate(u.reading_date), u.meter_reading, u.previous_reading || 0, u.consumption || 0, u.month || null, u.year || null, u.reading_status || 'normal', toMysqlDate(u.created_at)]
  );
};

const mirrorBill = async (b) => {
  if (!b) return;
  await run(
    `INSERT INTO bills
      (bill_id, account_number, month, year, total_amount_due, consumption, payment_status, due_date, generation_date, paid_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), ?)
     ON DUPLICATE KEY UPDATE
      account_number=VALUES(account_number), month=VALUES(month), year=VALUES(year), total_amount_due=VALUES(total_amount_due),
      consumption=VALUES(consumption), payment_status=VALUES(payment_status), due_date=VALUES(due_date),
      generation_date=VALUES(generation_date), paid_date=VALUES(paid_date)`,
    [b.bill_id, b.account_number, b.month || null, b.year || null, b.total_amount_due, b.consumption || null, b.payment_status || 'pending', toMysqlDate(b.due_date), toMysqlDate(b.generation_date), toMysqlDate(b.paid_date)]
  );
};

const mirrorPayment = async (p) => {
  if (!p) return;
  await run(
    `INSERT INTO payment_history
      (payment_id, account_number, bill_id, amount_paid, payment_method, transaction_id, receipt_number, payment_date, payment_status, card_holder)
     VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?)
     ON DUPLICATE KEY UPDATE
      account_number=VALUES(account_number), bill_id=VALUES(bill_id), amount_paid=VALUES(amount_paid), payment_method=VALUES(payment_method),
      transaction_id=VALUES(transaction_id), receipt_number=VALUES(receipt_number), payment_date=VALUES(payment_date), payment_status=VALUES(payment_status), card_holder=VALUES(card_holder)`,
    [p.payment_id, p.account_number, p.bill_id || null, p.amount_paid, p.payment_method || null, p.transaction_id || null, p.receipt_number || null, toMysqlDate(p.payment_date), p.payment_status || 'completed', p.card_holder || null]
  );
};

const mirrorNotification = async (n) => {
  if (!n) return;
  await run(
    `INSERT INTO notifications
      (notification_id, account_number, sender_account_number, sender_role, title, message, type, is_read, created_at, read_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?)
     ON DUPLICATE KEY UPDATE
      account_number=VALUES(account_number), sender_account_number=VALUES(sender_account_number), sender_role=VALUES(sender_role),
      title=VALUES(title), message=VALUES(message), type=VALUES(type), is_read=VALUES(is_read), created_at=VALUES(created_at), read_at=VALUES(read_at)`,
    [n.notification_id, n.account_number || null, n.sender_account_number || null, n.sender_role || null, n.title || null, n.message || null, n.type || null, !!n.is_read, toMysqlDate(n.created_at), toMysqlDate(n.read_at)]
  );
};

const deleteNotification = async (notificationId) => {
  await run('DELETE FROM notifications WHERE notification_id = ?', [notificationId]);
};

const mirrorLeakReport = async (r) => {
  if (!r) return;
  await run(
    `INSERT INTO leak_reports
      (leak_id, account_number, location, description, urgency, status, reported_at)
     VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
     ON DUPLICATE KEY UPDATE
      account_number=VALUES(account_number), location=VALUES(location), description=VALUES(description), urgency=VALUES(urgency), status=VALUES(status), reported_at=VALUES(reported_at)`,
    [r.leak_id, r.account_number || null, r.location || null, r.description || null, r.urgency || 'normal', r.status || 'pending', toMysqlDate(r.reported_at)]
  );
};

module.exports = {
  mirrorCustomer,
  deleteCustomer,
  mirrorBillingRate,
  deleteBillingRate,
  mirrorWaterUsage,
  mirrorBill,
  mirrorPayment,
  mirrorNotification,
  deleteNotification,
  mirrorLeakReport
};
