const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self'
  }
}, { _id: false });

const menuBuilderSchema = new mongoose.Schema({
  mainMenu: [menuItemSchema],
  premadeMenu: [menuItemSchema],
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuBuilder', menuBuilderSchema);