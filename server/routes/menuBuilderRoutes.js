const express = require('express');
const router = express.Router();
const { getMenuBuilder, updateMenuBuilder } = require('../controllers/menuBuilderController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ Fix here

// GET MenuBuilder
router.get('/', getMenuBuilder);

// UPDATE MenuBuilder
router.put('/', authMiddleware, updateMenuBuilder); // ✅ Use the correct function

module.exports = router;
