const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { authMiddleware } = require('../middlewares/authMiddleware');

// Configure multer
const upload = multer({ dest: 'uploads/' });

// 🟢 PUBLIC ROUTES (place specific routes first)
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/', getAllProducts);

router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
