const mongoose = require('mongoose');

const permalinkSchema = new mongoose.Schema({
  permalinks: {
    type: Map,
    of: String,
    default: {}
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Permalink', permalinkSchema);