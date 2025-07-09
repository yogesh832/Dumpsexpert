const express = require("express");
const router = express.Router();
const {
  getAnnouncement,
  updateAnnouncement,
} = require("../controllers/announcementController");
const { parser } = require("../utils/cloudinary");

// GET current announcement config
router.get("/", getAnnouncement);

router.post("/update", parser.single("image"), updateAnnouncement);

// POST to update config

module.exports = router;
