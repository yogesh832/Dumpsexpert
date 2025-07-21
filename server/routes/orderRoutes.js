const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/orderController');

// Changed from /create to / to match frontend call
router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/all', getAllOrders);

module.exports = router;