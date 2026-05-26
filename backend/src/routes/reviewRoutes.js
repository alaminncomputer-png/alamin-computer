import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
}));
router.post('/', protect, asyncHandler(async (req, res) => {
  const { product, rating, title, comment } = req.body;
  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) { res.status(400); throw new Error('You already reviewed this product'); }
  const review = await Review.create({ product, user: req.user._id, name: req.user.name, rating, title, comment });
  res.status(201).json(review);
}));
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await review.deleteOne();
  res.json({ message: 'Review removed' });
}));
export default router;
