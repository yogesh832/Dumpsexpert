const express = require("express");
const router = express.Router();

const { validateSignup, validateSignin } = require("../middlewares/validationMiddleware");
const { signup, signin, logout } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

// Protected routes
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

router.post("/logout", authMiddleware, logout);

module.exports = router;
