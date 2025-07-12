const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { authMiddleware } = require('../middlewares/authMiddleware');

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Public Routes
router.get('/:id', getProductById);
router.get('/', getAllProducts);

// Protected Routes (you can add authMiddleware here if needed later)
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 },
  ]),
  createProduct
);

router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 },
  ]),
  updateProduct
);

router.delete('/:id', deleteProduct);

module.exports = router;
