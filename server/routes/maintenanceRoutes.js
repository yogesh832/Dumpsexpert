const express = require('express');
const router = express.Router();
const {
  getMaintenanceSetting,
  updateMaintenanceSetting,
} = require('../controllers/maintenanceController');

const { parser } = require('../utils/cloudinary');

// Cloudinary file upload route
router.get('/', getMaintenanceSetting);
router.post('/update', parser.single('image'), updateMaintenanceSetting);

module.exports = router;
