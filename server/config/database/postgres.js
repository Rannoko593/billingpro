const { Pool } = require('pg');
require('dotenv').config();

const postgresPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '2002',
  database: process.env.PG_DATABASE || 'wasco_main',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

postgresPool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.message);
  } else {
    console.log('PostgreSQL connected successfully');
    release();
  }
});

module.exports = postgresPool;
