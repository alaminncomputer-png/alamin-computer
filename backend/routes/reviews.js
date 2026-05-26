// routes/reviews.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Review } = require('../models/index');
const { Order } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

// Get product reviews
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
}));

// Add review
router.post('/', protect, asyncHandler(async (req, res) => {
  const { product, rating, title, comment } = req.body;

  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error('You have already reviewed this product.');
  }

  // Check if verified purchase
  const order = await Order.findOne({
    user: req.user._id,
    'items.product': product,
    orderStatus: 'delivered',
  });

  const review = await Review.create({
    product,
    user: req.user._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!order,
    isApproved: false, // Requires admin approval
  });

  res.status(201).json({
    success: true,
    review,
    message: 'Review submitted. It will appear after admin approval.',
  });
}));

// Admin reply
router.put('/:id/reply', protect, adminOnly, asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { adminReply: req.body.reply },
    { new: true }
  );
  res.json({ success: true, review });
}));

module.exports = router;
