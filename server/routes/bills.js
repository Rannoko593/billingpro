const express = require('express');
const router = express.Router();

const billsController = require('../controllers/billsController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get(
  '/my-bills',
  authenticateToken,
  roleCheck(['customer', 'administrator']),
  billsController.getMyBills
);

router.get(
  '/all',
  authenticateToken,
  roleCheck(['branch_manager', 'administrator']),
  billsController.getAllBills
);

module.exports = router;