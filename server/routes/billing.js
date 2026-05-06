const express = require('express');
const router = express.Router();

const billingController = require('../controllers/billingController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post(
  '/generate',
  authenticateToken,
  roleCheck(['branch_manager', 'administrator']),
  billingController.generateBill
);

module.exports = router;