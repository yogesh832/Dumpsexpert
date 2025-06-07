const crypto = require("crypto");


exports.generateEmailOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex").toUpperCase();
};