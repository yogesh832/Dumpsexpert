const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFaqs,
  addProductFaq,
  getProductBySlug
} = require('../controllers/productController');

const upload = multer({ dest: 'uploads/' });

// 🟢 Product Routes
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug); // 👈 Add this BEFORE '/:id'

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 }
  ]),
  createProduct
);

router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 }
  ]),
  updateProduct
);

router.delete('/:id', deleteProduct);

// 🟡 FAQ Routes using Controller
router.get('/:id/faqs', getProductFaqs);
router.post('/:id/faqs', addProductFaq);

module.exports = router;
