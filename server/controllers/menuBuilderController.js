const MenuBuilder = require('../models/menuBuilderSchema');

// Get MenuBuilder data
exports.getMenuBuilder = async (req, res, next) => {
  try {
    const menuBuilder = await MenuBuilder.findOne().populate('lastUpdatedBy', 'username');
    if (!menuBuilder) {
      return res.status(404).json({ message: 'MenuBuilder not found' });
    }
    res.json(menuBuilder);
  } catch (error) {
    next(error);
  }
};

// Update MenuBuilder data
exports.updateMenuBuilder = async (req, res, next) => {
  try {
    const { mainMenu, premadeMenu } = req.body;

    // Validate input
    if (!mainMenu || !premadeMenu) {
      return res.status(400).json({ message: 'mainMenu and premadeMenu are required' });
    }

    const updates = {
      mainMenu,
      premadeMenu,
      lastUpdatedBy: req.user.id,
    };

    const menuBuilder = await MenuBuilder.findOneAndUpdate(
      {},
      updates,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(menuBuilder);
  } catch (error) {
    next(error);
  }
};