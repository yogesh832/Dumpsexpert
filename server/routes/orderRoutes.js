const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");

router.post("/create", createOrder);

// ✅ Apply auth middleware here:
router.get("/user/:userId", getUserOrders);

router.get("/all", getAllOrders);

module.exports = router;
