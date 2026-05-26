const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Order, Review } = require('../models/index');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── Dashboard Stats ────────────────────────────────
router.get('/stats', asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalRevenue,
    monthOrders,
    monthRevenue,
    lastMonthRevenue,
    totalProducts,
    totalUsers,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: startOfMonth }, paymentStatus: 'paid' }),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user' }),
    Order.countDocuments({ orderStatus: 'pending' }),
    Product.find({ stock: { $lte: 3 }, isActive: true }).select('name stock images brand').limit(10),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
    Product.find({ isActive: true }).sort({ sold: -1 }).limit(5).select('name sold price images brand'),
  ]);

  const thisMonthRev = monthRevenue[0]?.total || 0;
  const lastMonthRev = lastMonthRevenue[0]?.total || 0;
  const revenueGrowth = lastMonthRev
    ? (((thisMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1)
    : 100;

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthOrders,
      monthRevenue: thisMonthRev,
      revenueGrowth,
      totalProducts,
      totalUsers,
      pendingOrders,
    },
    lowStockProducts,
    recentOrders,
    topProducts,
  });
}));

// ── Sales Chart Data (last 7 days) ────────────────
router.get('/chart/sales', asyncHandler(async (req, res) => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data });
}));

// ── Get All Users ──────────────────────────────────
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({ success: true, users, total });
}));

// ── Update User Role ───────────────────────────────
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );
  res.json({ success: true, user });
}));

// ── Approve/Reject Reviews ────────────────────────
router.get('/reviews', asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
}));

router.put('/reviews/:id/approve', asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.approved },
    { new: true }
  );
  res.json({ success: true, review });
}));

// ── Category CRUD ──────────────────────────────────
const { Category } = require('../models/index');

router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1 });
  res.json({ success: true, categories });
}));

router.post('/categories', asyncHandler(async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json({ success: true, category: cat });
}));

router.put('/categories/:id', asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category: cat });
}));

router.delete('/categories/:id', asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted.' });
}));

module.exports = router;
