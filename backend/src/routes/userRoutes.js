import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images slug rating');
  res.json(user.wishlist);
}));
export default router;
