const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');

// POST a review for a product
router.post('/:productId', async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const { productId } = req.params;

    if (!name || !comment || !rating) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const review = new Review({
      product: productId,
      name,
      comment,
      rating,
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
