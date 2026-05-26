const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Order } = require('../models/index');
const Product = require('../models/Product');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// ── Create Order ──────────────────────────────────
router.post('/', optionalAuth, asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod, customerNote } = req.body;

  if (!items?.length) {
    res.status(400);
    throw new Error('Order must have at least one item.');
  }

  // Validate stock and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.product} not found.`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    const price = product.discountPrice || product.price;
    subtotal += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price,
      quantity: item.quantity,
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  const shippingCost = subtotal >= 10000 ? 0 : 150; // Free shipping over 10,000 ETB
  const total = subtotal + shippingCost;

  const order = await Order.create({
    user: req.user?._id || null,
    isGuestOrder: !req.user,
    items: orderItems,
    shipping,
    subtotal,
    shippingCost,
    total,
    paymentMethod,
    customerNote,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  res.status(201).json({ success: true, order });
}));

// ── Get User's Orders ─────────────────────────────
router.get('/my-orders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name slug images');
  res.json({ success: true, orders });
}));

// ── Get Single Order ──────────────────────────────
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name slug images brand')
    .populate('user', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  // Only allow owner or admin
  if (order.user?._id?.toString() !== req.user._id.toString() && req.user.role === 'user') {
    res.status(403);
    throw new Error('Not authorized to view this order.');
  }

  res.json({ success: true, order });
}));

// ── Admin: Get All Orders ──────────────────────────
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, paymentStatus } = req.query;
  const query = {};
  if (status) query.orderStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
}));

// ── Admin: Update Order Status ─────────────────────
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus, trackingNumber, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note: note || `Status updated to ${orderStatus}` });
  }
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  await order.save();
  res.json({ success: true, order });
}));

module.exports = router;
