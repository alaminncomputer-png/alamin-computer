const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ── Protect: require valid JWT ────────────────────
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. Please login.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('User not found or account deactivated.');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired token.');
  }
});

// ── Admin only ────────────────────────────────────
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }
  next();
});

// ── Super Admin only ──────────────────────────────
const superAdminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    res.status(403);
    throw new Error('Access denied. Super Admin only.');
  }
  next();
});

// ── Optional auth (doesn't fail if no token) ─────
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
});

// ── Generate JWT ──────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = { protect, adminOnly, superAdminOnly, optionalAuth, generateToken };
