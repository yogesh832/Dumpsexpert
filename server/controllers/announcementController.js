const AnnouncementSetting = require("../models/AnnouncementSetting");
const { deleteFromCloudinary } = require("../utils/cloudinary");

exports.getAnnouncement = async (req, res) => {
  try {
    const setting = await AnnouncementSetting.findOne().sort({ createdAt: -1 });
    res.json(setting || {});
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcement" });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { active, delay } = req.body;
    const file = req.file;

    const existing = await AnnouncementSetting.findOne();

    let update = {
      active,
      delay,
    };

    if (file) {
      if (existing?.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }
      update.imageUrl = file.path;
      update.imagePublicId = file.filename;
    } else if (!existing?.imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const updated = await AnnouncementSetting.findOneAndUpdate({}, update, {
      upsert: true,
      new: true,
    });

    res.json({ message: "Updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update announcement" });
  }
};

