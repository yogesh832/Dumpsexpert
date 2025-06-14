const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

// Public routes
router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);

// Protected routes (admin only)
router.get('/', isAuthenticated, getAllCoupons);
router.get('/:id', isAuthenticated, getCouponById);
router.post('/', isAuthenticated, createCoupon);
router.put('/:id', isAuthenticated, updateCoupon);
router.delete('/:id', isAuthenticated, deleteCoupon);

module.exports = router;