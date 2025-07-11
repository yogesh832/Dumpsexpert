const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayPalPayment
} = require('../controllers/paymentController');

// Razorpay routes
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', authMiddleware, verifyRazorpayPayment);

// PayPal route
router.post('/paypal/process', authMiddleware, processPayPalPayment);

module.exports = router;
