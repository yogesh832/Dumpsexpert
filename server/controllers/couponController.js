const Coupon = require("../models/CouponSchema");

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single coupon
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a coupon
// controllers/couponController.js

// controllers/couponController.js

exports.createCoupon = async (req, res) => {
  try {
    const { name, discount, startDate, endDate } = req.body;

    if (!name || !discount || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const trimmedName = name.trim().toUpperCase();

    // Auto generate code like COUPON_234
    const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digit random
    const code = `${trimmedName}_${randomSuffix}`;

    const newCoupon = new Coupon({
      name: trimmedName,
      code,
      discount,
      startDate,
      endDate,
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(400).json({ error: error.message });
  }
};



// Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update coupon", error: error.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted", id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
