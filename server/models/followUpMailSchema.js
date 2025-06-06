const mongoose = require('mongoose');

const followUpMailSchema = new mongoose.Schema({
  smtp: {
    type: String,
    trim: true
  },
  mailEngine: {
    type: String,
    trim: true
  },
  smtpHost: {
    type: String,
    required: true,
    trim: true
  },
  smtpPort: {
    type: Number,
    required: true
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
    select: false
  },
  fromEmail: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  fromName: {
    type: String,
    required: true,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FollowUpMail', followUpMailSchema);