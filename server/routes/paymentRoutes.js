// paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayPalPayment,
} = require('../controllers/paymentController');

// Razorpay routes - no auth middleware
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

// PayPal route - no auth middleware
router.post('/paypal/process', processPayPalPayment);

module.exports = router;