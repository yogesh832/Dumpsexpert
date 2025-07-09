// routes/preloaderRoutes.js
const express = require("express");
const router = express.Router();
const { parser } = require("../utils/cloudinary");
const { getPreloader, updatePreloader } = require("../controllers/preloaderController");

router.get("/", getPreloader);
router.post("/update", parser.single("image"), updatePreloader);

module.exports = router;
