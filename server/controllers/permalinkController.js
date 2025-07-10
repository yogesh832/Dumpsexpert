// controllers/permalinkController.js
const Permalink = require("../models/permalinkSchema");

exports.getPermalinks = async (req, res) => {
  try {
    const permalinks = await Permalink.find();
    res.json(permalinks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch permalinks" });
  }
};

exports.updatePermalinks = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Expected an array of permalinks" });
    }

    for (const item of updates) {
      if (!item._id || !item.slug) {
        return res.status(400).json({ error: "Each item must have _id and slug" });
      }
      await Permalink.findByIdAndUpdate(item._id, { slug: item.slug });
    }

    res.json({ message: "Permalinks updated successfully" });
  } catch (err) {
    console.error("❌ Error in updatePermalinks:", err);
    res.status(500).json({ error: "Failed to update permalinks" });
  }
};
