const express = require("express");
const router = express.Router();
const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blogCategoryController");
const { parser } = require("../utils/cloudinary");

router.post("/", parser.single("image"), createBlogCategory);
router.get("/", getAllBlogCategories);
router.get("/:id", getBlogCategoryById);
router.put("/:id", parser.single("image"), updateBlogCategory);
router.delete("/:id", deleteBlogCategory);

module.exports = router;
