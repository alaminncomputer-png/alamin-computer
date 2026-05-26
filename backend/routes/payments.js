const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Payment } = require('../models/index');
const { protect, optionalAuth } = require('../middleware/auth');

// ── Create Payment Intent ──────────────────────────
router.post('/create-intent', optionalAuth, asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  // Convert ETB to USD roughly for Stripe (Stripe doesn't support ETB)
  // In production, use a proper exchange rate API or use a supported currency
  const amountInCents = Math.round(order.total * 100); // Treat as USD cents for demo

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      customerEmail: order.shipping.email,
    },
    description: `Alamin Computer - Order ${order.orderNumber}`,
  });

  // Store payment record
  await Payment.create({
    order: order._id,
    user: req.user?._id,
    method: 'stripe',
    status: 'pending',
    amount: order.total,
    currency: 'etb',
    stripePaymentIntentId: paymentIntent.id,
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    orderId: order._id,
  });
}));

// ── Stripe Webhook ─────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const orderId = pi.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      stripePaymentIntentId: pi.id,
      $push: { statusHistory: { status: 'confirmed', note: 'Payment received via Stripe' } },
    });

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { status: 'succeeded', stripeChargeId: pi.latest_charge }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { status: 'failed' }
    );
    await Order.findByIdAndUpdate(pi.metadata.orderId, { paymentStatus: 'failed' });
  }

  res.json({ received: true });
}));

// ── Confirm Payment (after Stripe success on frontend) ──
router.post('/confirm', optionalAuth, asyncHandler(async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== 'succeeded') {
    res.status(400);
    throw new Error('Payment not confirmed yet.');
  }

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    $push: { statusHistory: { status: 'confirmed', note: 'Payment confirmed' } },
  });

  res.json({ success: true, message: 'Payment confirmed.' });
}));

module.exports = router;
