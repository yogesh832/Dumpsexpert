// controllers/menuBuilderController.js
const MenuBuilder = require("../models/menuBuilderSchema");

// ✅ Get existing menu or create default
exports.getMenuBuilder = async (req, res) => {
  try {
    let menuBuilder = await MenuBuilder.findOne().populate(
      "lastUpdatedBy",
      "username"
    );

    if (!menuBuilder) {
      menuBuilder = await MenuBuilder.create({
        mainMenu: [],
        premadeMenu: [
          { text: "Home", url: "/", target: "_self" },
          { text: "About", url: "/about", target: "_self" },
          { text: "Services", url: "/services", target: "_self" },
          { text: "Portfolios", url: "/portfolios", target: "_self" },
          { text: "Pages", url: "/pages", target: "_self" },
          { text: "Packages", url: "/packages", target: "_self" },
          { text: "Team", url: "/team", target: "_self" },
        ],
        lastUpdatedBy: null,
      });
    }

    res.json(menuBuilder);
  } catch (error) {
    console.error("Error fetching menu builder:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update full menu
exports.updateMenuBuilder = async (req, res) => {
  try {
    const { mainMenu, premadeMenu, userId } = req.body;

    if (!mainMenu || !premadeMenu || !userId) {
      return res
        .status(400)
        .json({ message: "mainMenu, premadeMenu, and userId are required" });
    }

    const updates = {
      mainMenu,
      premadeMenu,
      lastUpdatedBy: userId,
    };

    const menuBuilder = await MenuBuilder.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.json(menuBuilder);
  } catch (error) {
    console.error("Error updating menu builder:", error);
    res
      .status(500)
      .json({
        message: "Server error during menu update",
        error: error.message,
      });
  }
};
exports.updateAnnouncement = async (req, res) => {
  try {
    const { active, delay } = req.body;
    const file = req.file;

    const existing = await AnnouncementSetting.findOne();

    let updatedFields = {
      active,
      delay,
    };

    if (file) {
      // Delete old image
      if (existing?.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }
      updatedFields.imageUrl = file.path;
      updatedFields.imagePublicId = file.filename;
    }

    const newSetting = await AnnouncementSetting.findOneAndUpdate(
      {},
      updatedFields,
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Announcement updated", data: newSetting });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update announcement" });
  }
};

// ✅ Add single item to mainMenu or premadeMenu
exports.addMenuItem = async (req, res) => {
  try {
    const { type, item, userId } = req.body;

    if (!type || !["mainMenu", "premadeMenu"].includes(type)) {
      return res.status(400).json({ message: "Invalid menu type" });
    }

    if (!item || !item.text || !item.url) {
      return res
        .status(400)
        .json({ message: "Menu item must include text and url" });
    }

    const menuBuilder = await MenuBuilder.findOne();
    if (!menuBuilder)
      return res.status(404).json({ message: "MenuBuilder not found" });

    menuBuilder[type].push(item);
    menuBuilder.lastUpdatedBy = userId || null;

    await menuBuilder.save();
    res
      .status(200)
      .json({ message: "Item added successfully", data: menuBuilder });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res
      .status(500)
      .json({
        message: "Server error during item addition",
        error: error.message,
      });
  }
};
