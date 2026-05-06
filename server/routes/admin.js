const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authenticateToken);
router.use(roleCheck(['administrator']));

router.get('/stats', adminController.getDashboardStats);
router.get('/dashboard', adminController.getDashboardStats);

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);

router.get('/rates', adminController.getBillingRates);
router.post('/rates', adminController.createBillingRate);
router.put('/rates/:id', adminController.updateBillingRate);
router.delete('/rates/:id', adminController.deleteBillingRate);

router.get('/payments', adminController.getAllPayments);

router.get('/database/status', adminController.getDatabaseStatus);
router.post('/database/sync', adminController.syncDatabase);

module.exports = router;
