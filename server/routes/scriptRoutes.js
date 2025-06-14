const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Get all script settings (admin only)
router.get('/', scriptController.getScriptSettings);

// Get public script settings (for frontend use)
router.get('/public', scriptController.getPublicScriptSettings);

// Update script settings (admin only)
router.put('/', authMiddleware, scriptController.updateScriptSettings);

module.exports = router;