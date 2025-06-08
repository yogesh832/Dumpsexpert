const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["email", "google", "facebook"],
    default: "email",
  },
  providerId: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["guest", "student", "admin"],
    default: "guest",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//hashing of password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//generating the JWT here

userSchema.methods.generateJWT = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = mongoose.model("user", userSchema);
