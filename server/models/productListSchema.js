
const mongoose = require('mongoose');
const productListSchema = new mongoose.Schema({
  sapExamCode: String,
  imageUrl: String,
  title: String,
  price: String,
  category: String,
  status: String,
  action: String,
  samplePdfUrl: {
    type: String,
    default: ''
  },
  mainPdfUrl: {
    type: String,
    default: ''
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });
module.exports = mongoose.model('Product', productListSchema);
