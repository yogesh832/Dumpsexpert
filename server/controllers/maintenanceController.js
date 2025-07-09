const MaintenanceSetting = require('../models/maintenanceSetting');
const { deleteFromCloudinary } = require('../utils/cloudinary');

exports.getMaintenanceSetting = async (req, res) => {
  try {
    const setting = await MaintenanceSetting.findOne().sort({ createdAt: -1 });
    res.status(200).json(setting);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch setting", error: err.message });
  }
};

exports.updateMaintenanceSetting = async (req, res) => {
  try {
    const { maintenanceMode, maintenanceText } = req.body;
    const file = req.file;

    let setting = await MaintenanceSetting.findOne();

    let imageUrl = setting?.imageUrl;
    let imageId = setting?.imageId;

    if (file) {
      // delete old image if present
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }

      imageUrl = file.path;
      imageId = file.filename;
    }

    if (setting) {
      setting.maintenanceMode = maintenanceMode === 'true';
      setting.maintenanceText = maintenanceText;
      if (file) {
        setting.imageUrl = imageUrl;
        setting.imageId = imageId;
      }
      await setting.save();
    } else {
      setting = await MaintenanceSetting.create({
        maintenanceMode: maintenanceMode === 'true',
        maintenanceText,
        imageUrl,
        imageId
      });
    }

    res.status(200).json({ message: "Settings updated", setting });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
