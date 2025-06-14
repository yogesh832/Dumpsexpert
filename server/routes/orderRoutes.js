const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
// const { isAdmin } = require('../middleware/roleCheck');
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentDetails,
  cancelOrder,
  getOrderStatistics
} = require('../controllers/orderController');

// User routes (requires authentication)
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/:id/cancel', authMiddleware, cancelOrder);

// Admin routes (requires admin role)
// router.get('/', authMiddleware, isAdmin, getAllOrders);
// router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);
// router.put('/:id/payment', authMiddleware, isAdmin, updatePaymentDetails);
// router.get('/statistics/summary', authMiddleware, isAdmin, getOrderStatistics);

module.exports = router;