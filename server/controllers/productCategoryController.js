const ProductCategory = require('../models/productCategoryModel');
const { deleteFromCloudinary } = require('../utils/cloudinary');

exports.create = async (req, res, next) => {
  try {
    const { name, status = 'Ready' } = req.body;
    const image = req.file?.path;
    const public_id = req.file?.filename;

    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const newCategory = new ProductCategory({ name, status, image, public_id });
    const saved = await newCategory.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ CREATE ERROR:', error);
    next(error);
  }
};


exports.getAll = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, status } = req.body;
    const existing = await ProductCategory.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedFields = {
      name,
      status: status || existing.status
    };

    // 🔁 Handle image update
    if (req.file) {
      if (existing.public_id) {
        await deleteFromCloudinary(existing.public_id);
      }
      updatedFields.image = req.file.path;
      updatedFields.public_id = req.file.filename;
    }

    const updated = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error('❌ UPDATE ERROR:', error);
    next(error);
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.public_id) {
      await deleteFromCloudinary(category.public_id);
    }

    await ProductCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};
