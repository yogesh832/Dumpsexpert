const express = require('express');
const router = express.Router();
// const { authMiddleware } = require('../middlewares/authMiddleware'); ❌ Remove this line
// const { isAdmin } = require('../middlewares/roleCheck');

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

// ---------------- USER ROUTES (NO AUTH) ---------------- //
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

// ---------------- ADMIN ROUTES (NO AUTH) ---------------- //
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment', updatePaymentDetails);
router.get('/statistics/summary', getOrderStatistics);

module.exports = router;
