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
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, items, user } = req.body;
    console.log('Creating Razorpay order with:', { amount, currency, items, user });

    // Fallback userId if authMiddleware is not used
    const userId = req.user?._id || user || '663000000000000000000000';
    console.log('Resolved userId:', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return res.status(400).json({ message: `Invalid user ID: ${userId}` });
    }

    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: `User not found: ${userId}` });
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
    for (const item of items) {
      console.log('Processing item:', item);
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        console.log('Invalid product ID:', item.product);
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }
      const product = await mongoose.model('Product').findById(item.product);
      if (!product) {
        console.log('Product not found:', item.product);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      // Validate product fields
      if (!product.name || typeof product.name !== 'string') {
        console.log('Product missing name:', product);
        return res.status(400).json({ message: `Product missing name: ${item.product}` });
      }
      if (!product.price || isNaN(product.price) || product.price <= 0) {
        console.log('Product missing or invalid price:', product);
        return res.status(400).json({ message: `Product missing or invalid price: ${item.product}` });
      }
      const itemPrice = Number(product.price);
      const itemQuantity = Number(item.quantity);
      if (isNaN(itemQuantity) || itemQuantity <= 0) {
        console.log('Invalid item quantity:', item.quantity);
        return res.status(400).json({ message: `Invalid quantity for product: ${item.product}` });
      }
      const itemTotal = itemPrice * itemQuantity;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: itemQuantity,
      });
      subtotal += itemTotal;
    }

    // Validate subtotal
    if (isNaN(subtotal) || subtotal <= 0) {
      console.log('Invalid subtotal:', subtotal);
      return res.status(400).json({ message: 'Invalid subtotal calculated' });
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

    console.log('Saving order:', newOrder);
    await newOrder.save();
    console.log('Order created:', { id: newOrder._id, user: userId, total });

    // Verify Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('Razorpay credentials missing');
      return res.status(500).json({ message: 'Razorpay credentials missing' });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: `order_${newOrder._id}`,
    };

    console.log('Creating Razorpay order with options:', options);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('Razorpay order created:', { id: razorpayOrder.id, receipt: options.receipt });

    res.json({ ...razorpayOrder, orderId: newOrder._id.toString() });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message, error.stack);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

// RAZORPAY VERIFY PAYMENT
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, orderId } = req.body;
    console.log('Verifying payment with:', { razorpay_payment_id, razorpay_order_id, orderId });

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid orderId:', orderId);
      return res.status(400).json({ message: `Valid orderId is required: ${orderId}` });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: `Order not found: ${orderId}` });
    }

    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID from token:', userId);
      return res.status(400).json({ message: `Invalid user ID from token: ${userId}` });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const payment = await Payment.create({
        user: userId,
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed',
      });
      console.log('Payment created:', { id: payment._id, paymentId: razorpay_payment_id });

      await User.findByIdAndUpdate(userId, {
        subscription: 'yes',
        role: 'student',
      });

      order.paymentId = payment._id;
      order.paymentStatus = 'completed';
      order.status = 'completed';
      await order.save();
      console.log('Order updated:', { id: order._id, paymentId: payment._id });

      res.json({ success: true, orderId });
    } else {
      const payment = await Payment.create({
        user: userId,
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'failed',
      });
      console.log('Failed payment created:', { id: payment._id });

      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();
      console.log('Order updated to failed:', { id: order._id });

      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error.message, error.stack);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
};

// PAYPAL PAYMENT SUCCESS
const processPayPalPayment = async (req, res) => {
  try {
    const { orderID, amount, items, user } = req.body;
    console.log('Processing PayPal payment with:', { orderID, amount, items, user });

    const userId = req.user?._id || user || '663000000000000000000000';
    console.log('Resolved userId:', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return res.status(400).json({ message: `Invalid user ID: ${userId}` });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: `User not found: ${userId}` });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items:', items);
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    let subtotal = 0;
    const populatedItems = [];
    for (const item of items) {
      console.log('Processing item:', item);
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        console.log('Invalid product ID:', item.product);
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }
      const product = await mongoose.model('Product').findById(item.product);
      if (!product) {
        console.log('Product not found:', item.product);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (!product.name || typeof product.name !== 'string') {
        console.log('Product missing name:', product);
        return res.status(400).json({ message: `Product missing name: ${item.product}` });
      }
      if (!product.price || isNaN(product.price) || product.price <= 0) {
        console.log('Product missing or invalid price:', product);
        return res.status(400).json({ message: `Product missing or invalid price: ${item.product}` });
      }
      const itemPrice = Number(product.price);
      const itemQuantity = Number(item.quantity);
      if (isNaN(itemQuantity) || itemQuantity <= 0) {
        console.log('Invalid item quantity:', item.quantity);
        return res.status(400).json({ message: `Invalid quantity for product: ${item.product}` });
      }
      const itemTotal = itemPrice * itemQuantity;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: itemQuantity,
      });
      subtotal += itemTotal;
    }

    if (isNaN(subtotal) || subtotal <= 0) {
      console.log('Invalid subtotal:', subtotal);
      return res.status(400).json({ message: 'Invalid subtotal calculated' });
    }

    const total = subtotal;

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

    console.log('Saving order:', newOrder);
    await newOrder.save();
    console.log('PayPal order created:', { id: newOrder._id, user: userId });

    const payment = await Payment.create({
      user: userId,
      amount,
      currency: 'INR',
      paymentMethod: 'paypal',
      paymentId: orderID,
      status: 'completed',
    });
    console.log('PayPal payment created:', { id: payment._id, paymentId: orderID });

    await User.findByIdAndUpdate(userId, {
      subscription: 'yes',
      role: 'student',
    });

    newOrder.paymentId = payment._id;
    newOrder.paymentStatus = 'completed';
    newOrder.status = 'completed';
    await newOrder.save();
    console.log('PayPal order updated:', { id: newOrder._id, paymentId: payment._id });

    res.json({ success: true, orderId: newOrder._id.toString() });
  } catch (error) {
    console.error('PayPal payment processing failed:', error.message, error.stack);
    res.status(500).json({ error: 'Payment processing failed', details: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayPalPayment,
};