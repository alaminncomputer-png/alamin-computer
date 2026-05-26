const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "alamincomputers@gmail.com" });
    if (existing) {
      return res.json({ message: "Admin already exists!" });
    }
    const hashed = await bcrypt.hash("Admin@123456", 10);
    await User.create({
      name: "Admin",
      email: "alamincomputers@gmail.com",
      password: hashed,
      role: "admin",
    });
    res.json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
