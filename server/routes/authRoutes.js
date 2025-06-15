const express = require("express");
const router = express.Router();

const { signup, signin, logout, forgotPassword, resetPassword } = require("../controllers/authController");
const { sendOTPToUser, verifyOTP } = require("../controllers/otpController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const { validateSignup, validateSignin, validateResetPassword} = require("../middlewares/validationMiddleware");

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
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
  console.log("Token from cookie", req.cookies.token); // inside authMiddleware
});

module.exports = router;
