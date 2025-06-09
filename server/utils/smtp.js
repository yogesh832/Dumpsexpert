const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

// function to send OTP
const sendOTP = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Verify Email" <${process.env.SMTP_EMAIL}>`,
      to: toEmail,
      subject: "Your OTP for Email Verification",
      html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });
    console.log("OTP sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email", error);
    return false;
  }
};

module.exports = {
  sendOTP,
};
