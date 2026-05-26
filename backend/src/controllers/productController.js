import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort, condition, tag } = req.query;
  const query = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
  }
  if (search) query.$text = { $search: search };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (condition) query.condition = condition;
  if (tag) query.tags = { $in: [tag] };

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    popular: { sold: -1 },
    rating: { rating: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug icon')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total,
  });
});

// @route GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  const bestSellers = await Product.find({ isBestSeller: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  const newArrivals = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ featured, bestSellers, newArrivals });
});

// @route GET /api/products/:slug
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug icon');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4).populate('category', 'name slug');
  res.json({ product, related });
});

// @route POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  let slug = slugify(body.name);
  const exists = await Product.findOne({ slug });
  if (exists) slug = `${slug}-${Date.now()}`;
  const product = await Product.create({ ...body, slug });
  res.status(201).json(product);
});

// @route PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (req.body.name && req.body.name !== product.name) {
    req.body.slug = slugify(req.body.name);
  }
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  res.json(updated);
});

// @route DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});
