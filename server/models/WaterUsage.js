const postgresPool = require('../config/database/postgres');

const calculateAmount = (consumption = 0) => {
  const c = Number(consumption || 0);
  let amount = 0;
  if (c <= 10) amount = c * 5;
  else if (c <= 20) amount = 50 + ((c - 10) * 7.5);
  else if (c <= 30) amount = 125 + ((c - 20) * 10);
  else amount = 225 + ((c - 30) * 15);
  return Number((amount + 50).toFixed(2));
};

const mapUsage = (row) => row && ({
  ...row,
  id: row.usage_id,
  previousReading: Number(row.previous_reading || 0),
  currentReading: Number(row.meter_reading || 0),
  meterReading: Number(row.meter_reading || 0),
  consumption: Number(row.consumption || 0),
  amount: calculateAmount(row.consumption),
  readingDate: row.reading_date ? new Date(row.reading_date).toISOString().split('T')[0] : null,
});

class WaterUsage {
  static async create(usageData) {
    const { accountNumber, readingDate, meterReading, previousReading, consumption, month, year } = usageData;
    const result = await postgresPool.query(
      `INSERT INTO water_usage (account_number, reading_date, meter_reading, previous_reading, consumption, month, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [accountNumber, readingDate, meterReading, previousReading, consumption, month, year]
    );
    return mapUsage(result.rows[0]);
  }

  static async findByAccountNumber(accountNumber) {
    const result = await postgresPool.query(
      'SELECT * FROM water_usage WHERE account_number = $1 ORDER BY reading_date DESC, usage_id DESC',
      [accountNumber]
    );
    return result.rows.map(mapUsage);
  }

  static async getCurrentMonthUsage(accountNumber) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const result = await postgresPool.query(
      'SELECT * FROM water_usage WHERE account_number = $1 AND month = $2 AND year = $3 ORDER BY usage_id DESC LIMIT 1',
      [accountNumber, currentMonth, currentYear]
    );
    return mapUsage(result.rows[0]);
  }

  static async getMonthlyStats() {
    const result = await postgresPool.query(`
      SELECT month, year, COALESCE(SUM(consumption), 0) AS total_consumption, COUNT(*)::int AS total_readings
      FROM water_usage
      GROUP BY year, month
      ORDER BY year DESC, MAX(reading_date) DESC
      LIMIT 12
    `);
    return result.rows;
  }
}

module.exports = WaterUsage;
module.exports.calculateAmount = calculateAmount;
