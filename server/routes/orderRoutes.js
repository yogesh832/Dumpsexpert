const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
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
router.post('/', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getUserOrders);
router.get('/:id', isAuthenticated, getOrderById);
router.post('/:id/cancel', isAuthenticated, cancelOrder);

// Admin routes (requires admin role)
router.get('/', isAuthenticated, isAdmin, getAllOrders);
router.put('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);
router.put('/:id/payment', isAuthenticated, isAdmin, updatePaymentDetails);
router.get('/statistics/summary', isAuthenticated, isAdmin, getOrderStatistics);

module.exports = router;