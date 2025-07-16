const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const upload = multer({ dest: 'uploads/' });

router.get('/:id', getProductById);
router.get('/', getAllProducts);

router.post('/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 }
  ]),
  createProduct
);

router.put('/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'samplePdf', maxCount: 1 },
    { name: 'mainPdf', maxCount: 1 }
  ]),
  updateProduct
);

router.delete('/:id', deleteProduct);

module.exports = router;
