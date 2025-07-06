const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeSession,
  handleStripeWebhook
} = require('../controllers/paymentController');

// Razorpay routes
router.post('/razorpay/create-order', authMiddleware, createRazorpayOrder);
router.post('/razorpay/verify', authMiddleware, verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-session', authMiddleware, createStripeSession);
router.post('/stripe/webhook', handleStripeWebhook);

module.exports = router;