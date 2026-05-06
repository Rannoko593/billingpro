const postgresPool = require('../config/database/postgres');
const { mirrorNotification, deleteNotification: mirrorDeleteNotification } = require('../utils/mysqlMirror');

const roleCondition = (roles) => `LOWER(TRIM(COALESCE(role, ''))) IN (${roles.map((_, i) => `$${i + 6}`).join(',')})`;

const sendToQuery = async ({ target, senderAccount, senderRole, title, message, type }) => {
  const baseValues = [senderAccount, senderRole, title, message, type];

  if (target === 'ALL_CUSTOMERS') {
    return postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       SELECT account_number, $1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP
       FROM customers
       WHERE LOWER(TRIM(COALESCE(status, 'active'))) = 'active'
         AND ${roleCondition(['customer', 'customers', 'user'])}
       RETURNING *`,
      [...baseValues, 'customer', 'customers', 'user']
    );
  }

  if (target === 'ALL_MANAGERS') {
    return postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       SELECT account_number, $1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP
       FROM customers
       WHERE LOWER(TRIM(COALESCE(status, 'active'))) = 'active'
         AND ${roleCondition(['branch_manager', 'branch manager', 'manager'])}
       RETURNING *`,
      [...baseValues, 'branch_manager', 'branch manager', 'manager']
    );
  }

  if (target === 'ALL_ADMINS') {
    return postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       SELECT account_number, $1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP
       FROM customers
       WHERE LOWER(TRIM(COALESCE(status, 'active'))) = 'active'
         AND ${roleCondition(['administrator', 'admin'])}
       RETURNING *`,
      [...baseValues, 'administrator', 'admin']
    );
  }

  if (target === 'ALL') {
    return postgresPool.query(
      `INSERT INTO notifications
       (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
       SELECT account_number, $1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP
       FROM customers
       WHERE LOWER(TRIM(COALESCE(status, 'active'))) = 'active'
       RETURNING *`,
      baseValues
    );
  }

  return postgresPool.query(
    `INSERT INTO notifications
     (account_number, sender_account_number, sender_role, title, message, type, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, false, CURRENT_TIMESTAMP)
     RETURNING *`,
    [target, senderAccount, senderRole, title, message, type]
  );
};

const sendNotification = async (req, res) => {
  const { target, accountNumber, title, message, type = 'notice' } = req.body;
  const finalTarget = target || accountNumber;

  try {
    if (!finalTarget || !title || !message) {
      return res.status(400).json({ success: false, message: 'Target, title and message are required' });
    }

    const result = await sendToQuery({
      target: finalTarget,
      senderAccount: req.user.accountNumber || 'SYSTEM',
      senderRole: req.user.role || 'system',
      title,
      message,
      type
    });

    for (const row of result.rows) {
      await mirrorNotification(row);
    }

    res.json({
      success: true,
      message: 'Notification sent successfully',
      recipients: result.rowCount
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const result = await postgresPool.query(
      `SELECT *
       FROM notifications
       WHERE account_number = $1
       ORDER BY created_at DESC`,
      [req.user.accountNumber]
    );

    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('My notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await postgresPool.query(
      `UPDATE notifications
       SET is_read = true,
           read_at = CURRENT_TIMESTAMP
       WHERE notification_id = $1
         AND account_number = $2
       RETURNING *`,
      [id, req.user.accountNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await mirrorNotification(result.rows[0]);

    res.json({ success: true, message: 'Notification marked as read', notification: result.rows[0] });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await postgresPool.query(
      `DELETE FROM notifications
       WHERE notification_id = $1
         AND account_number = $2
       RETURNING notification_id`,
      [id, req.user.accountNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await mirrorDeleteNotification(id);

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReceivers = async (req, res) => {
  try {
    const result = await postgresPool.query(
      `SELECT customer_id, account_number, name, email, role, status
       FROM customers
       WHERE LOWER(TRIM(COALESCE(status, 'active'))) = 'active'
       ORDER BY role, name`
    );

    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error('Receivers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotificationAudit = async (req, res) => {
  try {
    const result = await postgresPool.query(
      `SELECT
          n.*,
          r.name AS receiver_name,
          r.role AS receiver_role,
          s.name AS sender_name
       FROM notifications n
       LEFT JOIN customers r ON r.account_number = n.account_number
       LEFT JOIN customers s ON s.account_number = n.sender_account_number
       ORDER BY n.created_at DESC`
    );

    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
  getReceivers,
  getNotificationAudit
};
