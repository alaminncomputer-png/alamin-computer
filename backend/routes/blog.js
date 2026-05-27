const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect, adminOnly } = require("../middleware/auth");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  tags: [String],
  readTime: String,
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

BlogSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
router.get("/:slug", async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
