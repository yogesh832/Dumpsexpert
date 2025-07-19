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
    console.log('Creating order with:', { amount, currency });
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

// RAZORPAY VERIFY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('Missing required fields:', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Check RAZORPAY_KEY_SECRET
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error: Missing RAZORPAY_KEY_SECRET' });
    }

    // Validate user authentication
    if (!req.user?._id) {
      console.error('User not authenticated:', { user: req.user });
      return res.status(401).json({ error: 'User not authenticated, please log in' });
    }

    // Generate signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    console.log('Verification Data:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      receivedSignature: razorpay_signature,
      expectedSignature: expectedSign,
      signString: sign,
      keySecret: process.env.RAZORPAY_KEY_SECRET.slice(0, 4) + '***',
      userId: req.user._id,
    });

    if (razorpay_signature === expectedSign) {
      try {
        const payment = await Payment.create({
          user: req.user._id,
          amount,
          currency: 'INR',
          paymentMethod: 'razorpay',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: 'completed',
        });
        console.log('Payment saved:', payment);
        return res.json({ success: true });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to save payment', details: dbError.message });
      }
    } else {
      console.error('Signature mismatch:', {
        received: razorpay_signature,
        expected: expectedSign,
      });
      return res.status(400).json({
        error: 'Invalid signature',
        received: razorpay_signature,
        expected: expectedSign,
      });
    }
  } catch (error) {
    console.error('Payment verification failed:', error.stack);
    return res.status(500).json({ error: 'Payment verification failed', details: error.message });
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