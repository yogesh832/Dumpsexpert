const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    // required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  coupon: {
    code: String,
    type: String,
    value: Number,
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    }
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    receiptUrl: String,
    cardLast4: String,
    cardBrand: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  notes: String,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Generate unique order number
OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const datePrefix = `${year}${month}${day}`;

      const Order = mongoose.model('Order');

      const lastOrder = await Order.findOne(
        { orderNumber: new RegExp(`^${datePrefix}`) },
        {},
        { sort: { orderNumber: -1 } }
      );

      let nextNumber = 1;
      if (lastOrder && lastOrder.orderNumber) {
        const lastNumber = parseInt(lastOrder.orderNumber.slice(6));
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      this.orderNumber = `${datePrefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model('Order', OrderSchema);
