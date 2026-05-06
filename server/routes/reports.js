const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const reportController = require('../controllers/reportController');

router.post(
  '/leak',
  authenticateToken,
  roleCheck(['customer', 'administrator']),
  reportController.submitLeakReport
);

router.get(
  '/leaks',
  authenticateToken,
  roleCheck(['branch_manager', 'administrator']),
  reportController.getLeakReports
);

module.exports = router;