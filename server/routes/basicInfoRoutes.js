const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  uploadFiles
} = require('../controllers/basicInfoController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET basic info settings
router.get('/', getSettings);

// UPDATE basic info settings
router.put('/', authMiddleware, uploadFiles, updateSettings);

module.exports = router;
