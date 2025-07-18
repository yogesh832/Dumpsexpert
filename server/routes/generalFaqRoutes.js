const express = require("express");
const router = express.Router();
const GeneralFAQ = require("../models/generalFaqSchema");

// Get all general FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await GeneralFAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch general FAQs", error: err.message });
  }
});

// Add a new general FAQ
router.post("/", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer)
    return res.status(400).json({ message: "Both question and answer are required." });

  try {
    const newFaq = new GeneralFAQ({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(500).json({ message: "Failed to add FAQ", error: err.message });
  }
});

module.exports = router;
