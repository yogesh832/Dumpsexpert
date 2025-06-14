const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');
const auth = require('../middleware/authMiddleware');

// Get all script settings (admin only)
router.get('/', scriptController.getScriptSettings);

// Get public script settings (for frontend use)
router.get('/public', scriptController.getPublicScriptSettings);

// Update script settings (admin only)
router.put('/', auth, scriptController.updateScriptSettings);

module.exports = router;