const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { parser } = require('../utils/cloudinary');

console.log({
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
});


// ✅ Specific routes FIRST
router.get('/all', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.post('/create', parser.single('image'), createBlog);
router.put('/:id', parser.single('image'), updateBlog);
router.delete('/:id', deleteBlog);

// ❗ Generic dynamic route LAST
router.get('/:id', getBlogById);

module.exports = router;
