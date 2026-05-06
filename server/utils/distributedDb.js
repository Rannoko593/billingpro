const postgresPool = require('../config/database/postgres');
const mysqlPool = require('../config/database/mysql');

const HIGHLANDS = new Set([
  'THABA-TSEKA', 'THABA TSEKA',
  'MOKHOTLONG',
  "QACHA'S NEK", 'QACHAS NEK', 'QACHA NEK',
  'BUTHA-BUTHE', 'BUTHA BUTHE'
]);

const normalizeDistrict = (district = '') => String(district).trim().toUpperCase().replace(/’/g, "'");
const isHighlandsDistrict = (district) => HIGHLANDS.has(normalizeDistrict(district));
const sourceForDistrict = (district) => (isHighlandsDistrict(district) ? 'mysql' : 'postgres');

const mysqlRows = async (sql, values = []) => {
  const [rows] = await mysqlPool.query(sql, values);
  return rows;
};

const pgRows = async (sql, values = []) => {
  const result = await postgresPool.query(sql, values);
  return result.rows;
};

const addSource = (row, source) => row ? { ...row, db_source: source, region_group: source === 'mysql' ? 'Highlands' : 'Lowlands' } : null;

const findCustomerByEmail = async (email) => {
  const pg = await pgRows('SELECT * FROM customers WHERE LOWER(email) = LOWER($1)', [email]);
  if (pg[0]) return addSource(pg[0], 'postgres');
  const my = await mysqlRows('SELECT * FROM customers WHERE LOWER(email) = LOWER(?)', [email]);
  return addSource(my[0], 'mysql');
};

const findCustomerByAccountNumber = async (accountNumber) => {
  const pg = await pgRows('SELECT * FROM customers WHERE account_number = $1', [accountNumber]);
  if (pg[0]) return addSource(pg[0], 'postgres');
  const my = await mysqlRows('SELECT * FROM customers WHERE account_number = ?', [accountNumber]);
  return addSource(my[0], 'mysql');
};

const findCustomerById = async (id) => {
  const pg = await pgRows('SELECT * FROM customers WHERE customer_id = $1', [id]);
  if (pg[0]) return addSource(pg[0], 'postgres');
  const my = await mysqlRows('SELECT * FROM customers WHERE customer_id = ?', [id]);
  return addSource(my[0], 'mysql');
};

const insertCustomer = async ({ accountNumber, name, email, phone, password, address, district, role = 'customer' }) => {
  if (sourceForDistrict(district) === 'mysql') {
    const [result] = await mysqlPool.query(
      `INSERT INTO customers (account_number, name, email, phone, password, address, district, role, registration_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'active')`,
      [accountNumber, name, email, phone || null, password, address || null, district || null, role]
    );
    await mysqlPool.query(
      `INSERT INTO users (customer_id, account_number, name, email, phone, password, address, district, role, registration_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'active')
       ON DUPLICATE KEY UPDATE account_number=VALUES(account_number), name=VALUES(name), email=VALUES(email), phone=VALUES(phone), password=VALUES(password), address=VALUES(address), district=VALUES(district), role=VALUES(role), status=VALUES(status)`,
      [result.insertId, accountNumber, name, email, phone || null, password, address || null, district || null, role]
    );
    const rows = await mysqlRows('SELECT * FROM customers WHERE customer_id = ?', [result.insertId]);
    return addSource(rows[0], 'mysql');
  }

  const rows = await pgRows(
    `INSERT INTO customers (account_number, name, email, phone, password, address, district, role, registration_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, 'active')
     RETURNING customer_id, account_number, name, email, phone, address, district, role, status, registration_date, created_at`,
    [accountNumber, name, email, phone || null, password, address || null, district || null, role]
  );
  return addSource(rows[0], 'postgres');
};

const getAllCustomers = async () => {
  const pg = await pgRows(`SELECT customer_id, account_number, name, email, phone, address, district, role, status, registration_date FROM customers`);
  const my = await mysqlRows(`SELECT customer_id, account_number, name, email, phone, address, district, role, status, registration_date FROM customers`);
  return [
    ...pg.map((r) => addSource(r, 'postgres')),
    ...my.map((r) => addSource(r, 'mysql'))
  ].sort((a, b) => String(a.role).localeCompare(String(b.role)) || String(a.name).localeCompare(String(b.name)));
};

const getAllCustomersOnly = async () => {
  const all = await getAllCustomers();
  return all.filter((u) => String(u.role || '').toLowerCase() === 'customer');
};

const deleteCustomer = async (id) => {
  const existing = await findCustomerById(id);
  if (!existing) return null;
  if (existing.db_source === 'mysql') {
    await mysqlPool.query('DELETE FROM customers WHERE customer_id = ?', [id]);
    await mysqlPool.query('DELETE FROM users WHERE customer_id = ?', [id]);
  } else {
    await postgresPool.query('DELETE FROM customers WHERE customer_id = $1', [id]);
  }
  return existing;
};

const updateCustomer = async (id, fields) => {
  const existing = await findCustomerById(id);
  if (!existing) return null;
  const next = { ...existing, ...fields };

  // If district changes across regions, move the record to the other database.
  const target = sourceForDistrict(next.district);
  if (target !== existing.db_source) {
    await deleteCustomer(id);
    return insertCustomer({
      accountNumber: next.account_number,
      name: next.name,
      email: next.email,
      phone: next.phone,
      password: next.password,
      address: next.address,
      district: next.district,
      role: next.role
    });
  }

  if (existing.db_source === 'mysql') {
    await mysqlPool.query(
      `UPDATE customers SET name=?, email=?, account_number=?, phone=?, address=?, district=?, role=?, status=? WHERE customer_id=?`,
      [next.name, next.email, next.account_number, next.phone || null, next.address || null, next.district || null, next.role, next.status || 'active', id]
    );
    await mysqlPool.query(
      `UPDATE users SET name=?, email=?, account_number=?, phone=?, address=?, district=?, role=?, status=? WHERE customer_id=?`,
      [next.name, next.email, next.account_number, next.phone || null, next.address || null, next.district || null, next.role, next.status || 'active', id]
    );
    const rows = await mysqlRows('SELECT * FROM customers WHERE customer_id = ?', [id]);
    return addSource(rows[0], 'mysql');
  }

  const rows = await pgRows(
    `UPDATE customers SET name=$1, email=$2, account_number=$3, phone=$4, address=$5, district=$6, role=$7, status=$8
     WHERE customer_id=$9 RETURNING customer_id, account_number, name, email, phone, address, district, role, status, registration_date, created_at`,
    [next.name, next.email, next.account_number, next.phone || null, next.address || null, next.district || null, next.role, next.status || 'active', id]
  );
  return addSource(rows[0], 'postgres');
};

module.exports = {
  HIGHLANDS,
  isHighlandsDistrict,
  sourceForDistrict,
  mysqlRows,
  pgRows,
  addSource,
  findCustomerByEmail,
  findCustomerByAccountNumber,
  findCustomerById,
  insertCustomer,
  getAllCustomers,
  getAllCustomersOnly,
  updateCustomer,
  deleteCustomer
};
