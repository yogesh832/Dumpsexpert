// controllers/preloaderController.js
const Preloader = require("../models/Preloader");
const { deleteFromCloudinary } = require("../utils/cloudinary");

exports.getPreloader = async (req, res) => {
  const preloader = await Preloader.findOne();
  res.json(preloader || {});
};

exports.updatePreloader = async (req, res) => {
  try {
    const { active, backgroundColor } = req.body;
    const file = req.file;

    const existing = await Preloader.findOne();
    let update = { active, backgroundColor };

    if (file) {
      if (existing?.imagePublicId) await deleteFromCloudinary(existing.imagePublicId);
      update.imageUrl = file.path;
      update.imagePublicId = file.filename;
    }

    const updated = await Preloader.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    });

    res.json({ message: "Preloader updated", data: updated });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Error updating preloader" });
  }
};
