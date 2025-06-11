const express = require("express");
const router = express.Router();

const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/addBlogCategoryController");

// You can protect routes using auth middleware if needed
router.post("/", createBlogCategory);
router.get("/", getAllBlogCategories);
router.get("/:id", getBlogCategoryById);
router.put("/:id", updateBlogCategory);
router.delete("/:id", deleteBlogCategory);

module.exports = router;
