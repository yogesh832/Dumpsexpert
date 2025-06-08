const OTP = require("../models/otpSchema");
const User = require("../models/userSchema");
const { sendOTP } = require("../utils/smtp");
const { generateEmailOTP } = require("../utils/otp");

exports.sendOTPToUser = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateEmailOTP();
    const sent = await sendOTP(email, otp);
    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during OTP sending" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const match = await OTP.findOne({ email, otp });
    if (!match) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteOne({ email });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during OTP verification" });
  }
};