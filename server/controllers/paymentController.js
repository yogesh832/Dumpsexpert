const Payment = require('../models/paymentSchema');
const User = require('../models/userSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// RAZORPAY CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

// RAZORPAY VERIFY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await User.findByIdAndUpdate(req.user._id, {
        subscription: 'yes',
        role: 'student'
      });

      await Payment.create({
        user: req.user._id,
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed'
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// PAYPAL PAYMENT SUCCESS (Frontend should call this after PayPal approval)
exports.processPayPalPayment = async (req, res) => {
  try {
    const { orderID, amount } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      subscription: 'yes',
      role: 'student'
    });

    await Payment.create({
      user: req.user._id,
      amount,
      currency: 'INR',
      paymentMethod: 'paypal',
      paymentId: orderID,
      status: 'completed'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('PayPal payment processing failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};
