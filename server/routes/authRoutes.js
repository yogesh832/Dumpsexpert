const express = require("express");
const router = express.Router();

const { signup, signin, logout, forgotPassword, resetPassword } = require("../controllers/authController");
const { sendOTPToUser, verifyOTP } = require("../controllers/otpController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const { validateSignup, validateSignin, validateResetPassword} = require("../middlewares/validationMiddleware");
const User = require("../models/userSchema");

router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);
router.post("/logout", authMiddleware, logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

// Add these new routes
router.post("/email/send-otp", sendOTPToUser);
router.post("/email/verify-otp", verifyOTP);

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

//route for frontend state restoration
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("email role image googleImage");
    let image = user.googleImage || user.image || null;
    res.json({ ...req.user, image });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

module.exports = router;
