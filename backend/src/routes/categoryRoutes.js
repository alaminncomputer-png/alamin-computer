import express from 'express';
import Category from '../models/Category.js';
import { protect, admin } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();
router.get('/', asyncHandler(async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort({ order: 1 });
  res.json(cats);
}));
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
}));
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
}));
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category removed' });
}));
export default router;
