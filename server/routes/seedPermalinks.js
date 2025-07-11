const express = require("express");
const router = express.Router();
const Permalink = require("../models/permalinkSchema");

const defaultPermalinks = [
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

router.get("/", async (req, res) => {
  try {
    const existing = await Permalink.find();
    if (existing.length === 0) {
      await Permalink.insertMany(defaultPermalinks);
      return res.json({ message: "Seeded default permalinks" });
    }
    res.json({ message: "Permalinks already exist" });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed permalinks" });
  }
});

module.exports = router;
