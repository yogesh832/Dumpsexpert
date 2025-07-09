const mongoose = require('mongoose');

const maintenanceSettingSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    required: false,
  },
  imageId: {
    type: String,
    required: false,
  },
  maintenanceText: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceSetting', maintenanceSettingSchema);
