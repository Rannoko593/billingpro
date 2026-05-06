const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authenticateToken);

router.get('/my', notificationController.getMyNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

router.get(
  '/receivers',
  roleCheck(['administrator', 'branch_manager']),
  notificationController.getReceivers
);

router.post(
  '/send',
  roleCheck(['administrator', 'branch_manager']),
  notificationController.sendNotification
);

router.get(
  '/audit',
  roleCheck(['administrator']),
  notificationController.getNotificationAudit
);

module.exports = router;