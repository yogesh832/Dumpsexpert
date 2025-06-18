const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/productCategoryController');

const { parser } = require('../utils/cloudinary');

// Public routes
router.get('/', getAll);
router.get('/:id', getById);

// CRUD with Cloudinary
router.post('/', parser.single('image'), create);
router.put('/:id', parser.single('image'), update);
router.delete('/:id', remove);

module.exports = router;
