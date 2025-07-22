const User = require("../models/userSchema");
const ResetToken = require("../models/resetTokenSchema");
const { generateResetToken } = require("../utils/otp");
const { sendOTP } = require("../utils/smtp");

const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already exists" });

    const newUser = new User({ email, password });
    await newUser.save();

    const token = newUser.generateJWT();

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "User registered successfully",
        user: { email: newUser.email, role: newUser.role },
      });
  } catch (error) {
    res.status(500).json({ error: "Server error during signup" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = user.generateJWT();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "User signed in successfully",
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Server error during signin" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If the email is registered, a password reset link has been sent",
      });
    }

    const token = generateResetToken();
    await ResetToken.deleteMany({ email });
    await ResetToken.create({ email, token });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
    await sendOTP(email, `Click to reset your password: ${resetLink}`);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const resetToken = await ResetToken.findOne({ email, token });
    if (!resetToken)
      return res.status(400).json({ error: "Invalid or expired token" });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await ResetToken.deleteOne({ email, token });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error during password reset" });
  }
};

exports.handleSocialCallback = (req, res) => {
  try {
    const token = req.user.generateJWT();
    const role = req.user.role;
    let redirectUrl = "http://dumpsexpert.vercel.app";

    if (role === "admin") {
      redirectUrl += "/admin/dashboard";
    } else if (role === "student") {
      redirectUrl += "/student/dashboard";
    } else {
      redirectUrl += "/guest/dashboard";
    }

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("https://dumpsexpert.vercel.app/login?error=auth_failed");
  }
};
