const mongoose = require('mongoose');
const Order = require('../models/orderSchema');
const { applyCouponToOrder } = require('./couponController');

// 📦 Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      couponCode,
      paymentMethod,
      billingAddress,
      notes
    } = req.body;

    const userId = req.body.user || '663000000000000000000000'; // Replace with dummy or frontend-provided ID

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    if (!billingAddress) {
      return res.status(400).json({ message: 'Billing address is required' });
    }

    let subtotal = 0;
    const productIds = [];
    const categoryIds = [];
    const populatedItems = [];

    for (const item of items) {
      const product = await mongoose.model('Product').findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;

      populatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity
      });

      subtotal += itemTotal;
      productIds.push(product._id);
      if (product.category) categoryIds.push(product.category);
    }

    let discount = 0;
    let couponData = null;

    if (couponCode) {
      const couponResult = await applyCouponToOrder(couponCode, subtotal, productIds, categoryIds);
      if (couponResult.valid) {
        discount = couponResult.discountAmount;
        couponData = {
          code: couponResult.code,
          type: couponResult.type,
          value: couponResult.value,
          couponId: couponResult.couponId
        };
      }
    }

    const taxRate = 0;
    const tax = subtotal * taxRate;
    const total = subtotal - discount + tax;

    const newOrder = new Order({
      user: userId,
      items: populatedItems,
      subtotal,
      discount,
      coupon: couponData,
      tax,
      total,
      paymentMethod,
      billingAddress,
      notes: notes || '',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔍 Get all orders (with filters)
exports.getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .populate('paymentId', 'paymentId status amount currency paymentMethod') // Populate payment details
      .populate('coupon.couponId', 'code type value')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    console.log('Retrieved orders:', orders.length, 'Total:', total); // Debug log

    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

// 👤 Get user-specific orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.user || req.body.user;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name')
      .populate('paymentId', 'paymentId status amount currency paymentMethod') // Populate payment details
      .populate('coupon.couponId', 'code type value')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ user: userId });

    res.status(200).json({
      message: 'User orders retrieved successfully',
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders', error: error.message });
  }
};

// 🔎 Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .populate('paymentId', 'paymentId status amount currency paymentMethod') // Populate payment details
      .populate('coupon.couponId', 'code type value');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error: error.message });
  }
};

// 📊 Order statistics
exports.getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }

    const totalOrders = await Order.countDocuments(dateQuery);

    const ordersByStatus = await Order.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } },
    ]);

    const ordersByPaymentStatus = await Order.aggregate([
      { $match: dateQuery },
      {
        $lookup: {
          from: 'payments',
          localField: 'paymentId',
          foreignField: '_id',
          as: 'payment',
        },
      },
      { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
    ]);

    const revenue = await Order.aggregate([
      { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' }, subtotal: { $sum: '$subtotal' }, discount: { $sum: '$discount' }, tax: { $sum: '$tax' } } },
    ]);

    const ordersByDate = await Order.aggregate([
      { $match: dateQuery },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, total: { $sum: '$total' } } },
    ]);

    console.log('Order statistics:', { totalOrders, ordersByStatus, ordersByPaymentStatus }); // Debug log

    res.status(200).json({
      message: 'Statistics retrieved',
      data: {
        totalOrders,
        ordersByStatus,
        ordersByPaymentStatus,
        revenue: revenue[0] || {},
        ordersByDate,
      },
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Error getting statistics', error: error.message });
  }
};
// 🛑 Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'completed' || order.status === 'refunded') {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    res.status(200).json({ message: 'Order updated', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// 💳 Update payment details
exports.updatePaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      paymentStatus,
      transactionId,
      paymentDate,
      receiptUrl,
      cardLast4,
      cardBrand
    } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.paymentDetails = {
      ...order.paymentDetails,
      transactionId,
      paymentDate: paymentDate ? new Date(paymentDate) : undefined,
      receiptUrl,
      cardLast4,
      cardBrand
    };

    await order.save();

    res.status(200).json({ message: 'Payment details updated', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};
