const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {validateSignup,validateSignin} = require("../middlewares/validationMiddleware");
const { signup, signin, logout } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);
router.post("/logout", logout);

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

module.exports = router;
