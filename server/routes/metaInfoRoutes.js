const express = require('express');
const router = express.Router();
const metaInfoController = require('../controllers/metaInfoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Get all meta information
router.get('/', metaInfoController.getAllMetaInfo);

// Get meta information for a specific page
router.get('/:page', metaInfoController.getMetaInfoByPage);

// Update all meta information
router.put('/', authMiddleware, metaInfoController.updateAllMetaInfo);

// Update meta information for a specific page
router.put('/:page', authMiddleware, metaInfoController.updateMetaInfoByPage);

module.exports = router;
