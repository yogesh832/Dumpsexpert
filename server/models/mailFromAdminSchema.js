const mongoose = require('mongoose');

const mailFromAdminSchema = new mongoose.Schema({
  smtp: {
    type: String,
    trim: true,
    default: null // Optional: Allow null if not provided
  },
  mailEngine: {
    type: String,
    trim: true,
    default: null // Optional: Allow null if not provided
  },
  smtpHost: {
    type: String,
    required: true,
    trim: true
  },
  smtpPort: {
    type: Number,
    required: true,
    min: 1, // Ensure valid port number
    max: 65535 // Standard max port number
  },
  encryption: {
    type: String,
    enum: ['SSL', 'TLS', 'STARTTLS', 'None'],
    default: 'None'
  },
  smtpUsername: {
    type: String,
    required: true,
    trim: true
  },
  smtpPassword: {
    type: String,
    required: true,
    select: false // Prevents password from being returned in queries
  },
  formEmail: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  formName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100 // Optional: Limit length for safety
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Optional: Add an index for faster queries
mailFromAdminSchema.index({ formEmail: 1 });

module.exports = mongoose.model('MailFromAdmin', mailFromAdminSchema);