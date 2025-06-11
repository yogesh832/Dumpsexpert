const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  uploadFiles
} = require('../controllers/basicInfoController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/', getSettings);

// router.put('/', authMiddleware, uploadFiles, updateSettings);

module.exports = router;
