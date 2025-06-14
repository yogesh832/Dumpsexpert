const mongoose = require('mongoose');

// Define Coupon schema
const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', CouponSchema);

// Get all coupons (admin only)
exports.getAllCoupons = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const coupons = await Coupon.find(query)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Coupon.countDocuments(query);
    
    res.status(200).json({
      message: 'Coupons retrieved successfully',
      data: coupons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving coupons:', error);
    res.status(500).json({
      message: 'Server error while retrieving coupons',
      error: error.message
    });
  }
};

// Get active coupons (public)
exports.getActiveCoupons = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find active coupons that haven't expired and haven't reached usage limit
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    })
    .select('code type value minPurchase maxDiscount endDate description')
    .exec();
    
    res.status(200).json({
      message: 'Active coupons retrieved successfully',
      data: coupons
    });
  } catch (error) {
    console.error('Error retrieving active coupons:', error);
    res.status(500).json({
      message: 'Server error while retrieving active coupons',
      error: error.message
    });
  }
};

// Get coupon by ID (admin only)
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .populate('applicableProducts', 'name price')
      .populate('applicableCategories', 'name');
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.status(200).json({
      message: 'Coupon retrieved successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error retrieving coupon:', error);
    res.status(500).json({
      message: 'Server error while retrieving coupon',
      error: error.message
    });
  }
};

// Validate coupon (public)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, productIds = [], categoryIds = [] } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }
    
    const currentDate = new Date();
    
    // Find the coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    });
    
    if (!coupon) {
      return res.status(404).json({ 
        message: 'Invalid or expired coupon code',
        valid: false
      });
    }
    
    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase amount of $${coupon.minPurchase} required`,
        valid: false,
        minPurchase: coupon.minPurchase
      });
    }
    
    // Check if coupon is applicable to the products/categories in cart
    let isApplicable = true;
    let applicableMessage = '';
    
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some(id => 
        coupon.applicableProducts.some(productId => productId.toString() === id)
      );
      
      if (!hasApplicableProduct) {
        isApplicable = false;
        applicableMessage = 'Coupon is not applicable to the products in your cart';
      }
    }
    
    if (isApplicable && coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categoryIds.some(id => 
        coupon.applicableCategories.some(categoryId => categoryId.toString() === id)
      );
      
      if (!hasApplicableCategory) {
        isApplicable = false;
        applicableMessage = 'Coupon is not applicable to the product categories in your cart';
      }
    }
    
    if (!isApplicable) {
      return res.status(400).json({
        message: applicableMessage,
        valid: false
      });
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100;
      
      // Apply maximum discount limit if set
      if (coupon.maxDiscount !== null && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else { // fixed amount
      discountAmount = coupon.value;
      
      // Ensure discount doesn't exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }
    }
    
    res.status(200).json({
      message: 'Coupon applied successfully',
      valid: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: parseFloat(discountAmount.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      message: 'Server error while validating coupon',
      error: error.message,
      valid: false
    });
  }
};

// Create a new coupon (admin only)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      applicableProducts,
      applicableCategories,
      description
    } = req.body;
    
    const userId = req.user?._id;
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Validate required fields
    if (!code || !type || value === undefined || !endDate) {
      return res.status(400).json({ message: 'Code, type, value, and end date are required' });
    }
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    
    // Create new coupon
    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      minPurchase: minPurchase || 0,
      maxDiscount: maxDiscount || null,
      startDate: startDate || new Date(),
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || null,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      description: description || '',
      createdBy: userId,
      lastUpdatedBy: userId
    });
    
    await newCoupon.save();
    
    res.status(201).json({
      message: 'Coupon created successfully',
      data: newCoupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      message: 'Server error while creating coupon',
      error: error.message
    });
  }
};

// Update a coupon (admin only)
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      applicableProducts,
      applicableCategories,
      description
    } = req.body;
    
    const userId = req.user?._id;
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find the coupon
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    // Check if updated code already exists (if code is being changed)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      
      coupon.code = code.toUpperCase();
    }
    
    // Update fields if provided
    if (type) coupon.type = type;
    if (value !== undefined) coupon.value = value;
    if (minPurchase !== undefined) coupon.minPurchase = minPurchase;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (startDate) coupon.startDate = startDate;
    if (endDate) coupon.endDate = endDate;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (description !== undefined) coupon.description = description;
    
    coupon.lastUpdatedBy = userId;
    
    await coupon.save();
    
    res.status(200).json({
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      message: 'Server error while updating coupon',
      error: error.message
    });
  }
};

// Delete a coupon (admin only)
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find the coupon
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    await Coupon.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Coupon deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      message: 'Server error while deleting coupon',
      error: error.message
    });
  }
};

// Apply coupon to order (internal use)
exports.applyCouponToOrder = async (couponCode, cartTotal, productIds = [], categoryIds = []) => {
  try {
    if (!couponCode) {
      return { valid: false, message: 'No coupon code provided' };
    }
    
    const currentDate = new Date();
    
    // Find the coupon
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    });
    
    if (!coupon) {
      return { valid: false, message: 'Invalid or expired coupon code' };
    }
    
    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return { 
        valid: false, 
        message: `Minimum purchase amount of $${coupon.minPurchase} required`,
        minPurchase: coupon.minPurchase
      };
    }
    
    // Check if coupon is applicable to the products/categories in cart
    let isApplicable = true;
    let applicableMessage = '';
    
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some(id => 
        coupon.applicableProducts.some(productId => productId.toString() === id.toString())
      );
      
      if (!hasApplicableProduct) {
        isApplicable = false;
        applicableMessage = 'Coupon is not applicable to the products in your cart';
      }
    }
    
    if (isApplicable && coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categoryIds.some(id => 
        coupon.applicableCategories.some(categoryId => categoryId.toString() === id.toString())
      );
      
      if (!hasApplicableCategory) {
        isApplicable = false;
        applicableMessage = 'Coupon is not applicable to the product categories in your cart';
      }
    }
    
    if (!isApplicable) {
      return { valid: false, message: applicableMessage };
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100;
      
      // Apply maximum discount limit if set
      if (coupon.maxDiscount !== null && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else { // fixed amount
      discountAmount = coupon.value;
      
      // Ensure discount doesn't exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }
    }
    
    // Increment used count
    coupon.usedCount += 1;
    await coupon.save();
    
    return {
      valid: true,
      message: 'Coupon applied successfully',
      couponId: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: parseFloat(discountAmount.toFixed(2))
    };
  } catch (error) {
    console.error('Error applying coupon to order:', error);
    return { valid: false, message: 'Error applying coupon', error: error.message };
  }
};