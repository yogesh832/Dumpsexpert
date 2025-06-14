const mongoose = require('mongoose');
const { applyCouponToOrder } = require('./couponController');

// Define Order schema
const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  coupon: {
    code: String,
    type: String,
    value: Number,
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    }
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    receiptUrl: String,
    cardLast4: String,
    cardBrand: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  notes: String,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

// Generate unique order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;
    
    // Find the highest order number with this date prefix
    const lastOrder = await this.constructor.findOne(
      { orderNumber: new RegExp(`^${datePrefix}`) },
      {},
      { sort: { orderNumber: -1 } }
    );
    
    let nextNumber = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastNumber = parseInt(lastOrder.orderNumber.substr(6));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    // Generate the new order number
    this.orderNumber = `${datePrefix}${nextNumber.toString().padStart(4, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', OrderSchema);

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      couponCode,
      paymentMethod,
      billingAddress,
      notes
    } = req.body;
    
    const userId = req.user?._id;
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }
    
    if (!billingAddress) {
      return res.status(400).json({ message: 'Billing address is required' });
    }
    
    // Calculate subtotal
    let subtotal = 0;
    const productIds = [];
    const categoryIds = [];
    
    // Validate and populate items
    const populatedItems = [];
    for (const item of items) {
      if (!item.product || !item.price || !item.quantity) {
        return res.status(400).json({ message: 'Invalid order item' });
      }
      
      // Get product details from database to ensure price is correct
      const product = await mongoose.model('Product').findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      
      // Use the actual product price from database
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
      
      // Collect category IDs if available
      if (product.category) {
        categoryIds.push(product.category);
      }
    }
    
    // Apply coupon if provided
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
    
    // Calculate tax (if applicable)
    const taxRate = 0; // Set your tax rate here or fetch from settings
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal - discount + tax;
    
    // Create new order
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
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// Get all orders (admin only)
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
      sortOrder = 'desc' 
    } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({
      message: 'Server error while retrieving orders',
      error: error.message
    });
  }
};

// Get orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Order.countDocuments({ user: userId });
    
    res.status(200).json({
      message: 'User orders retrieved successfully',
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(500).json({
      message: 'Server error while retrieving user orders',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const isAdmin = req.user?.role === 'admin';
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .populate('coupon.couponId', 'code type value');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (!isAdmin && order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.status(200).json({
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({
      message: 'Server error while retrieving order',
      error: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update fields if provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;
    
    await order.save();
    
    res.status(200).json({
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};

// Update payment details (admin only)
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
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update payment status if provided
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Update payment details
    order.paymentDetails = order.paymentDetails || {};
    
    if (transactionId) order.paymentDetails.transactionId = transactionId;
    if (paymentDate) order.paymentDetails.paymentDate = new Date(paymentDate);
    if (receiptUrl) order.paymentDetails.receiptUrl = receiptUrl;
    if (cardLast4) order.paymentDetails.cardLast4 = cardLast4;
    if (cardBrand) order.paymentDetails.cardBrand = cardBrand;
    
    await order.save();
    
    res.status(200).json({
      message: 'Payment details updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating payment details:', error);
    res.status(500).json({
      message: 'Server error while updating payment details',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const isAdmin = req.user?.role === 'admin';
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to cancel this order
    if (!isAdmin && order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled
    if (order.status === 'completed' || order.status === 'refunded') {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }
    
    // Update order status
    order.status = 'cancelled';
    
    await order.save();
    
    res.status(200).json({
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
};

// Get order statistics (admin only)
exports.getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date range query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) dateQuery.createdAt.$lte = new Date(endDate);
    }
    
    // Get total orders count
    const totalOrders = await Order.countDocuments(dateQuery);
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: dateQuery },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Get orders by payment status
    const ordersByPaymentStatus = await Order.aggregate([
      { $match: dateQuery },
      { $group: {
        _id: '$paymentStatus',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { ...dateQuery, status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: {
        _id: null,
        total: { $sum: '$total' },
        subtotal: { $sum: '$subtotal' },
        discount: { $sum: '$discount' },
        tax: { $sum: '$tax' }
      }}
    ]);
    
    const revenue = revenueResult.length > 0 ? revenueResult[0] : {
      total: 0,
      subtotal: 0,
      discount: 0,
      tax: 0
    };
    
    // Get orders by date
    const ordersByDate = await Order.aggregate([
      { $match: dateQuery },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      message: 'Order statistics retrieved successfully',
      data: {
        totalOrders,
        ordersByStatus,
        ordersByPaymentStatus,
        revenue,
        ordersByDate
      }
    });
  } catch (error) {
    console.error('Error retrieving order statistics:', error);
    res.status(500).json({
      message: 'Server error while retrieving order statistics',
      error: error.message
    });
  }
};