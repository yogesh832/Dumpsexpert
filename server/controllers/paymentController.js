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
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: currency || "INR",
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    // Send the complete order object
    res.json({
      id: order.id,            // This is the order_id
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
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

    // Generate the signature verification string
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Log the values for debugging
    console.log('Verification Data:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: process.env.RAZORPAY_KEY_SECRET?.slice(0, 4) + '***',
    });

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    console.log('Generated Signature:', expectedSign);
    console.log('Received Signature:', razorpay_signature);

    if (razorpay_signature === expectedSign) {
      await Payment.create({
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id, // Optionally store orderId
        status: 'completed',
      });

      res.json({ success: true });
    } else {
      console.log('Signature Mismatch');
      res.status(400).json({
        error: 'Invalid signature',
        expected: expectedSign,
        received: razorpay_signature,
      });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
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