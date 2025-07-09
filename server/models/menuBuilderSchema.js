// models/menuBuilderSchema.js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    url: { type: String, required: true },
    target: {
      type: String,
      enum: ["_self", "_blank"],
      default: "_self",
    },
  },
  { _id: false }
);

const menuBuilderSchema = new mongoose.Schema(
  {
    mainMenu: [menuItemSchema],
    premadeMenu: [menuItemSchema],
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuBuilder", menuBuilderSchema);
