// routes/basicInfoRoutes.js
const express = require('express');
const router = express.Router();
const basicInfoController = require('../controllers/basicInfoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', basicInfoController.getSettings);
router.put(
  '/',
  authMiddleware,
  basicInfoController.uploadFiles,
  basicInfoController.updateSettings
);

module.exports = router;