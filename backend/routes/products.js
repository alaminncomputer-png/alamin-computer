const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// ── GET All Products (with filters/search/pagination) ───
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    condition,
    sort = '-createdAt',
    isFeatured,
    isBestSeller,
    isNewArrival,
    isStudentPick,
    tags,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (condition) query.condition = condition;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (isFeatured === 'true') query.isFeatured = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isStudentPick === 'true') query.isStudentPick = true;
  if (tags) query.tags = { $in: tags.split(',') };

  const skip = (Number(page) - 1) * Number(limit);

  const sortMap = {
    '-createdAt': { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'popular': { 'ratings.average': -1 },
    'best-seller': { sold: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug icon')
      .select('-description -specifications.ports')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}));

// ── GET Featured/Special Lists ─────────────────────
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8).lean();
  res.json({ success: true, products });
}));

router.get('/best-sellers', asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ sold: -1 }).limit(8).lean();
  res.json({ success: true, products });
}));

router.get('/new-arrivals', asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 }).limit(8).lean();
  res.json({ success: true, products });
}));

// ── GET Single Product by slug ─────────────────────
router.get('/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug, isActive: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('category', 'name slug icon');

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Get related products (same category, exclude current)
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .select('name slug images price discountPrice ratings brand condition')
    .limit(4).lean();

  res.json({ success: true, product, related });
}));

// ── CREATE Product (Admin) ─────────────────────────
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
}));

// ── UPDATE Product (Admin) ─────────────────────────
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  res.json({ success: true, product });
}));

// ── DELETE Product (Admin) ─────────────────────────
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  res.json({ success: true, message: 'Product deleted successfully.' });
}));

// ── Brands list ────────────────────────────────────
router.get('/meta/brands', asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand', { isActive: true });
  res.json({ success: true, brands: brands.sort() });
}));

module.exports = router;
