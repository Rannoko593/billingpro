const mysql = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let mysqlPool = null;

if (isProduction) {
  console.log('ℹ️ MySQL/XAMPP skipped in production. Using PostgreSQL/Neon instead.');
} else {
  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'wasco_logs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  (async () => {
    try {
      const connection = await mysqlPool.getConnection();
      await connection.ping();
      console.log('✅ MySQL/XAMPP Connected Successfully');
      connection.release();
    } catch (err) {
      console.error('❌ MySQL/XAMPP Connection Error:', err.message);
    }
  })();
}

module.exports = mysqlPool;
