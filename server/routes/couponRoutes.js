const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
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
router.get('/', authMiddleware, getAllCoupons);
router.get('/:id', authMiddleware, getCouponById);
router.post('/', authMiddleware, createCoupon);
router.put('/:id', authMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, deleteCoupon);

module.exports = router;