const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  uploadFiles
} = require('../controllers/basicInfoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', basicInfoController.getSettings);
// router.put(
//   '/',
//   authMiddleware,
//   basicInfoController.uploadFiles,
//   basicInfoController.updateSettings
// );

// router.put('/', authMiddleware, uploadFiles, updateSettings);

module.exports = router;
