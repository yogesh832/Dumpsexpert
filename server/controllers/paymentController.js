const Payment = require('../models/paymentSchema');
const User = require('../models/userSchema');
const Order = require('../models/orderSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// RAZORPAY CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, items, user } = req.body;
    console.log('Creating Razorpay order with:', { amount, currency, items, user }); // Debug log

    // Fallback userId if authMiddleware is not used
    const userId = req.user?._id || user || '663000000000000000000000';
    console.log('Resolved userId:', userId); // Debug log
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Validate inputs
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items:', items);
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Create order
    let subtotal = 0;
    const populatedItems = [];
    const productIds = [];

    for (const item of items) {
      console.log('Processing item:', item); // Debug log
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        console.log('Invalid product ID:', item.product);
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }
      const product = await mongoose.model('Product').findById(item.product);
      if (!product) {
        console.log('Product not found:', item.product);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
      });
      subtotal += itemTotal;
      productIds.push(product._id);
    }

    const total = subtotal; // Add discount/tax logic if needed

    const newOrder = new Order({
      user: userId,
      items: populatedItems,
      subtotal,
      total,
      paymentMethod: 'razorpay',
      status: 'pending',
      paymentStatus: 'pending',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    console.log('Saving order:', newOrder); // Debug log
    await newOrder.save();
    console.log('Order created:', { id: newOrder._id, user: userId, total }); // Debug log

    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: `order_${newOrder._id}`,
    };

    console.log('Creating Razorpay order with options:', options); // Debug log
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created:', { id: razorpayOrder.id, receipt: options.receipt }); // Debug log

    res.json({ ...razorpayOrder, orderId: newOrder._id.toString() });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message, error.stack); // Enhanced error logging
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

// RAZORPAY VERIFY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, orderId } = req.body;
    console.log('Verifying payment with:', { razorpay_payment_id, razorpay_order_id, orderId }); // Debug log

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid orderId:', orderId);
      return res.status(400).json({ message: 'Valid orderId is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: `Order not found: ${orderId}` });
    }

    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID from token:', userId);
      return res.status(400).json({ message: 'Invalid user ID from token' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Create Payment record
      const payment = await Payment.create({
        user: userId,
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed',
      });
      console.log('Payment created:', { id: payment._id, paymentId: razorpay_payment_id }); // Debug log

      // Update User subscription and role
      await User.findByIdAndUpdate(userId, {
        subscription: 'yes',
        role: 'student',
      });

      // Update Order with paymentId and status
      order.paymentId = payment._id;
      order.paymentStatus = 'completed';
      order.status = 'completed';
      await order.save();
      console.log('Order updated:', { id: order._id, paymentId: payment._id }); // Debug log

      res.json({ success: true, orderId });
    } else {
      // Create failed Payment record
      const payment = await Payment.create({
        user: userId,
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'failed',
      });
      console.log('Failed payment created:', { id: payment._id }); // Debug log

      // Update Order to failed
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();
      console.log('Order updated to failed:', { id: order._id }); // Debug log

      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error.message, error.stack); // Enhanced error logging
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
};

// PAYPAL PAYMENT SUCCESS
exports.processPayPalPayment = async (req, res) => {
  try {
    const { orderID, amount, items, user } = req.body;
    console.log('Processing PayPal payment with:', { orderID, amount, items, user }); // Debug log

    const userId = req.user?._id || user || '663000000000000000000000';
    console.log('Resolved userId:', userId); // Debug log
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items:', items);
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Create order
    let subtotal = 0;
    const populatedItems = [];
    for (const item of items) {
      console.log('Processing item:', item); // Debug log
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        console.log('Invalid product ID:', item.product);
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }
      const product = await mongoose.model('Product').findById(item.product);
      if (!product) {
        console.log('Product not found:', item.product);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
      });
      subtotal += itemTotal;
    }

    const total = subtotal; // Add discount/tax logic if needed

    const newOrder = new Order({
      user: userId,
      items: populatedItems,
      subtotal,
      total,
      paymentMethod: 'paypal',
      status: 'pending',
      paymentStatus: 'pending',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    console.log('Saving order:', newOrder); // Debug log
    await newOrder.save();
    console.log('PayPal order created:', { id: newOrder._id, user: userId }); // Debug log

    // Create Payment record
    const payment = await Payment.create({
      user: userId,
      amount,
      currency: 'INR',
      paymentMethod: 'paypal',
      paymentId: orderID,
      status: 'completed',
    });
    console.log('PayPal payment created:', { id: payment._id, paymentId: orderID }); // Debug log

    // Update User subscription and role
    await User.findByIdAndUpdate(userId, {
      subscription: 'yes',
      role: 'student',
    });

    // Update Order with paymentId and status
    newOrder.paymentId = payment._id;
    newOrder.paymentStatus = 'completed';
    newOrder.status = 'completed';
    await newOrder.save();
    console.log('PayPal order updated:', { id: newOrder._id, paymentId: payment._id }); // Debug log

    res.json({ success: true, orderId: newOrder._id.toString() });
  } catch (error) {
    console.error('PayPal payment processing failed:', error.message, error.stack); // Enhanced error logging
    res.status(500).json({ error: 'Payment processing failed', details: error.message });
  }
};