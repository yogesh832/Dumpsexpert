const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');


router.get('/',  getAllCoupons);
router.get('/:id',  getCouponById);
router.post('/',  createCoupon);
router.put('/:id',  updateCoupon);
router.delete('/:id',  deleteCoupon);

module.exports = router;