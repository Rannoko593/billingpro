const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/auth');

router.get('/paypal/config', authenticateToken, paymentController.getPaypalConfig);
router.post('/paypal/create-order', authenticateToken, paymentController.createPayPalOrder);
router.post('/paypal/capture-order', authenticateToken, paymentController.capturePayPalOrder);
router.post('/pay', authenticateToken, paymentController.payBill);
router.post('/initiate', authenticateToken, paymentController.payBill);
router.get('/history', authenticateToken, paymentController.getMyPaymentHistory);
router.get('/receipt/:id', authenticateToken, paymentController.getReceipt);

module.exports = router;