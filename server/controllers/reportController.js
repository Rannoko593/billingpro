const postgresPool = require('../config/database/postgres');
const { mirrorLeakReport, mirrorNotification } = require('../utils/mysqlMirror');

const submitLeakReport = async (req, res) => {
  const { location, description, urgency } = req.body;

  try {
    if (!location || !description || !urgency) {
      return res.status(400).json({
        success: false,
        message: 'Location, description and urgency are required'
      });
    }

    const accountNumber = req.user.accountNumber;

    const leakResult = await postgresPool.query(
      `INSERT INTO leak_reports
       (account_number, location, description, urgency, status, reported_at)
       VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
       RETURNING *`,
      [accountNumber, location, description, urgency]
    );

    const leak = leakResult.rows[0];

    const managerNotifications = await postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       SELECT
          account_number,
          $1,
          $2,
          $3,
          $4,
          $5,
          false,
          CURRENT_TIMESTAMP
       FROM customers
       WHERE role IN ('branch_manager', 'administrator')
         AND status = 'active'
       RETURNING *`,
      [
        accountNumber,
        req.user.role,
        location,
        description,
        urgency
      ]
    );

    const confirmationNotification = await postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        accountNumber,
        accountNumber,
        req.user.role,
        'Leak Report Submitted',
        `Your leak report for "${location}" has been submitted successfully.`,
        'confirmation'
      ]
    );

    await mirrorLeakReport(leak);
    for (const row of managerNotifications.rows) await mirrorNotification(row);
    await mirrorNotification(confirmationNotification.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Leak report submitted and sent to managers/admins',
      leak
    });
  } catch (error) {
    console.error('Submit leak report error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLeakReports = async (req, res) => {
  try {
    const result = await postgresPool.query(`
      SELECT
        lr.*,
        c.name,
        c.email,
        c.phone,
        c.district
      FROM leak_reports lr
      LEFT JOIN customers c ON c.account_number = lr.account_number
      ORDER BY lr.reported_at DESC
    `);

    res.json({
      success: true,
      leaks: result.rows
    });
  } catch (error) {
    console.error('Get leak reports error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  submitLeakReport,
  getLeakReports
};