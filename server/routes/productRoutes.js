const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const { parser } = require('../utils/cloudinary');

// Get all products with pagination and filtering
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/id/:id', productController.getProductById);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Create a new product
router.post('/', auth, parser.single('image'), productController.createProduct);

// Update a product
router.put('/:id', auth, parser.single('image'), productController.updateProduct);

// Delete a product
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;