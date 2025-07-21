const Order = require('../models/orderSchema');

// Create order after successful payment
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, paymentId } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }

    const courseDetails = items.map(item => ({
      courseId: item._id,
      name: item.title || item.name,
      price: item.price,
      sapExamCode: item.sapExamCode,
      category: item.category,
      sku: item.sku,
      samplePdfUrl: item.samplePdfUrl,
      mainPdfUrl: item.mainPdfUrl,
      slug: item.slug
    }));

    const newOrder = new Order({
      user: userId,
      courseDetails,
      totalAmount,
      paymentMethod,
      paymentId,
      status: 'completed',
      currency: 'INR'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate('courseDetails.courseId', 'name description') // Add fields you want from Product
      .populate('paymentId')
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('courseDetails.courseId', 'name description') // Add fields you want from Product
      .populate('paymentId')
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};