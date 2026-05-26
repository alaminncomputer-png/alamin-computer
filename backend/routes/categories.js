const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Category } = require('../models/index');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json({ success: true, categories });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!cat) { res.status(404); throw new Error('Category not found.'); }
  res.json({ success: true, category: cat });
}));

module.exports = router;
