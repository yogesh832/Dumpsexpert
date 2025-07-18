const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayPalPayment,
} = require('../controllers/paymentController');

// Razorpay routes
router.post('/orders/razorpay/create', createRazorpayOrder); // Updated path
router.post('/orders/razorpay/verify', authMiddleware, verifyRazorpayPayment); // Updated path

// PayPal route
router.post('/orders/paypal/process', authMiddleware, processPayPalPayment); // Updated path

module.exports = router;