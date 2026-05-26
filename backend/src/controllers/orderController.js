import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendEmail } from '../utils/email.js';

// @route POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  // Verify products & calculate prices
  let itemsPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
    });
    itemsPrice += product.price * item.quantity;

    // Decrement stock
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice >= 10000 ? 0 : 200;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice: 0,
    totalPrice,
    notes,
  });

  // Send confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed — ${order.orderNumber} | Alamin Computer`,
      html: `
        <h2>Thank you for your order, ${req.user.name}!</h2>
        <p>Order Number: <strong>${order.orderNumber}</strong></p>
        <p>Total: <strong>ETB ${totalPrice.toLocaleString()}</strong></p>
        <p>Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        <p>We'll contact you soon to confirm delivery details.</p>
        <p>WhatsApp: ${process.env.WHATSAPP_NUMBER}</p>
      `,
    });
  } catch (err) {
    console.log('Order email failed:', err.message);
  }

  res.status(201).json(order);
});

// @route GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images slug');
  res.json(orders);
});

// @route GET /api/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images slug');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  // Only the order owner or admin can view
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

// @route PUT /api/orders/:id/pay (Stripe webhook sets this)
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.orderStatus = 'confirmed';
  await order.save();
  res.json({ message: 'Order paid', order });
});

// @route GET /api/orders (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ orders, total, pages: Math.ceil(total / limit) });
});

// @route PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = req.body.status;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (req.body.status === 'cancelled') {
    order.cancelReason = req.body.cancelReason;
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }
  }
  await order.save();
  res.json({ message: 'Order status updated', order });
});
