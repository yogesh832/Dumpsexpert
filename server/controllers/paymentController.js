const Payment = require('../models/paymentSchema');
const Order = require('../models/orderSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_7kAotmP1o8JR8V',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret', // Replace with actual secret or ensure env variable
});

// RAZORPAY CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', items = [], userId = '663000000000000000000000' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database with default userId if not provided
    const order = new Order({
      user: userId,
      items: items.map(item => ({
        product: item.product || item._id,
        name: item.title || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      subtotal: amount,
      total: amount,
      paymentMethod: 'razorpay',
      status: 'pending',
      paymentStatus: 'pending',
    });

    await order.save();

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

// RAZORPAY VERIFY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, orderId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Create payment record
      const payment = await Payment.create({
        user: '663000000000000000000000', // Default userId
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed',
      });

      // Update order
      await Order.findByIdAndUpdate(orderId, {
        paymentId: payment._id,
        status: 'completed',
        paymentStatus: 'completed',
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

// PAYPAL PAYMENT PROCESS
exports.processPayPalPayment = async (req, res) => {
  try {
    const { orderID, amount } = req.body;

    if (!orderID || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create payment record
    await Payment.create({
      user: '663000000000000000000000', // Default userId
      amount,
      currency: 'INR',
      paymentMethod: 'paypal',
      paymentId: orderID,
      status: 'completed',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('PayPal payment processing failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};