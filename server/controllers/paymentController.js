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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, userId } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !amount) {
      console.error('Missing required fields:', { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount });
      return res.status(400).json({ success: false, error: 'Missing required payment details' });
    }

    // Validate environment variable
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay key secret not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      console.error('Signature verification failed:', { razorpay_payment_id, razorpay_order_id });
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // Verify amount with Razorpay API
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.amount !== Math.round(amount * 100)) {
      console.error('Amount mismatch:', { provided: amount, actual: payment.amount / 100 });
      return res.status(400).json({ success: false, error: 'Amount mismatch' });
    }

    // Update user and create payment record concurrently
    const operations = [
      Payment.create({
        user: userId || null, // Avoid hardcoded ID; use null if no user
        amount: payment.amount / 100, // Store in rupees
        currency: payment.currency || 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'completed',
      }),
    ];

    if (userId) {
      operations.push(
        User.findByIdAndUpdate(userId, {
          subscription: 'yes',
          role: 'student',
        }, { new: true })
      );
    }

    await Promise.all(operations);

    console.log('Payment verified and processed:', { razorpay_payment_id, razorpay_order_id, userId });
    return res.status(200).json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification failed:', {
      error: error.message,
      stack: error.stack,
      paymentId: req.body.razorpay_payment_id,
      userId: req.body.userId,
    });
    return res.status(500).json({ success: false, error: 'Payment verification failed' });
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