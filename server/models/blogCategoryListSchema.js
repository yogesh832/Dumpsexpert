const mongoose = require('mongoose');

const blogCategoryListSchema = new mongoose.Schema({
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory'
    }
  ]
});

module.exports = mongoose.model('BlogCategoryList', blogCategoryListSchema);