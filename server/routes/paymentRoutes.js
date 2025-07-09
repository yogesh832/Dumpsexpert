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
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', authMiddleware, verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-session', createStripeSession);
router.post('/stripe/webhook', handleStripeWebhook);

module.exports = router;