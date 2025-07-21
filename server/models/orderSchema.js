const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
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

// Add a pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Get the current date components
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Find the latest order number for today
    const latestOrder = await this.constructor.findOne(
      { orderNumber: new RegExp(`^${year}${month}${day}`) },
      { orderNumber: 1 },
      { sort: { orderNumber: -1 } }
    );

    let sequence = '0001';
    if (latestOrder) {
      const lastSequence = parseInt(latestOrder.orderNumber.slice(-4));
      sequence = String(lastSequence + 1).padStart(4, '0');
    }

    // Generate order number: YYYYMMDD####
    this.orderNumber = `${year}${month}${day}${sequence}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);