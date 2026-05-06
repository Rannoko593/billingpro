const express = require('express');
const router = express.Router();

const usageController = require('../controllers/usageController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get(
  '/my-usage',
  authenticateToken,
  roleCheck(['customer', 'administrator']),
  usageController.getMyUsageSummary
);

router.get(
  '/history',
  authenticateToken,
  roleCheck(['customer', 'administrator']),
  usageController.getMyUsageHistory
);

module.exports = router;