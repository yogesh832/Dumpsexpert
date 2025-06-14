const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/addBlogCategory");

// Public routes
router.get("/", getAllBlogCategories);
router.get("/:id", getBlogCategoryById);

// Protected routes
router.post("/", authMiddleware, createBlogCategory);
router.put("/:id", authMiddleware, updateBlogCategory);
router.delete("/:id", authMiddleware, deleteBlogCategory);

module.exports = router;
