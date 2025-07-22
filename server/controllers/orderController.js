const Order = require('../models/orderSchema');
const jwt = require("jsonwebtoken");

// 🔐 Utility: Get userId from JWT (cookie or header)
const getUserIdFromRequest = (req) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Use env variable in prod
    return decoded.userId;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
};

// 🛒 Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentId, userId: userIdFromBody } = req.body;

    // ✅ Use JWT OR fallback to passed userId (for localStorage testing)
    const userId = getUserIdFromRequest(req) || userIdFromBody;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
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

// 👤 Get Orders for Logged-In or Specific User
exports.getUserOrders = async (req, res) => {
  try {
    const paramUserId = req.params.userId;
    const authUserId = getUserIdFromRequest(req);
    const userId = authUserId || paramUserId || req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate('courseDetails.courseId', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("getUserOrders error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🛠 Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('courseDetails.courseId', 'name description')
      .populate('paymentId') // assuming this is a ref
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};
