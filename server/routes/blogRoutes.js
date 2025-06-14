const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/addBlogCategoryController");

// Public routes - can be accessed without authentication
router.get("/", getAllBlogCategories);
router.get("/:id", getBlogCategoryById);

// Protected routes - require authentication
router.post("/", auth, createBlogCategory);
router.put("/:id", auth, updateBlogCategory);
router.delete("/:id", auth, deleteBlogCategory);

module.exports = router;
