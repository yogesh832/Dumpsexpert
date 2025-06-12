const express = require('express');
const router = express.Router();
const { getMenuBuilder, updateMenuBuilder } = require('../controllers/menuBuilderController');
const auth = require('../middlewares/authMiddleware');

// GET MenuBuilder
router.get('/', getMenuBuilder);

// UPDATE MenuBuilder
// router.put('/', auth, updateMenuBuilder);

module.exports = router;