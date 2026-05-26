import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @route POST /api/payment/create-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // cents
    currency: 'etb',
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// @route POST /api/payment/webhook
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const order = await Order.findById(pi.metadata.orderId);
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = 'confirmed';
      order.paymentResult = { id: pi.id, status: pi.status };
      await order.save();
    }
  }

  res.json({ received: true });
});
