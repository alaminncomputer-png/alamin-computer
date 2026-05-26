import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// @route GET /api/admin/dashboard
export const getDashboard = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, totalRevenue, pendingOrders, recentOrders] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

  // Monthly revenue last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Top products
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
    },
    monthlyRevenue,
    topProducts,
    recentOrders,
  });
});

// @route GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const total = await User.countDocuments(query);
  const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ users, total, pages: Math.ceil(total / limit) });
});

// @route PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// @route GET /api/admin/reviews
export const getReviews = asyncHandler(async (req, res) => {
  const { approved } = req.query;
  const query = approved !== undefined ? { isApproved: approved === 'true' } : {};
  const reviews = await Review.find(query)
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @route PUT /api/admin/reviews/:id/approve
export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json(review);
});

// @route DELETE /api/admin/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});
