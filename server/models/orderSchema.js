const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  courseDetails: [{
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    sapExamCode: String,
    category: String,
    sku: String,
    samplePdfUrl: String,
    mainPdfUrl: String,
    slug: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: { 
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay', 'paypal']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  }
});

module.exports = mongoose.model('Order', orderSchema);