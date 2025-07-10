const express = require('express');
const router = express.Router();
const controller = require('../controllers/permalinkController');
const Permalink = require("../models/permalinkSchema"); // ✅ Add this line

// GET all permalinks
router.get('/', controller.getPermalinks);

// UPDATE all permalinks
router.put('/', controller.updatePermalinks);

// TEMP: Seed initial permalinks
router.post("/seed", async (req, res) => {
  try {
    const seedData = [
      { pageName: "About", slug: "about" },
      { pageName: "Portfolio", slug: "portfolio" },
      { pageName: "Team", slug: "team" },
      { pageName: "Gallery", slug: "gallery" },
      { pageName: "Blog", slug: "blog" },
      { pageName: "Contact", slug: "contact" },
      { pageName: "Cart", slug: "cart" },
      { pageName: "Service", slug: "service" },
      { pageName: "Package", slug: "package" },
      { pageName: "FAQ", slug: "faq" },
      { pageName: "Career", slug: "career" },
      { pageName: "Product", slug: "product" },
      { pageName: "Get A Quote", slug: "get-a-quote" },
      { pageName: "Checkout", slug: "checkout" },
    ];

    await Permalink.insertMany(seedData);
    res.json({ message: "Seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Seeding failed" });
  }
});

module.exports = router;
