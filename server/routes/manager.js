const express = require('express');
const managerController = require('../controllers/managerController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(authenticateToken);
router.use(roleCheck(['branch_manager', 'administrator']));

router.get('/stats', managerController.getManagerStats);
router.get('/customers', managerController.getCustomers);

router.get('/reports', managerController.generateFlexibleReport);
router.get('/reports/:period', managerController.generateReport);

router.post('/notifications', managerController.sendNotification);
router.get('/notifications', managerController.getNotifications);

module.exports = router;