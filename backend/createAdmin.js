const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = "mongodb+srv://alamin:Password6212@cluster0.kuvfzsj.mongodb.net/alamin-computer";

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected!');
  const User = require('./models/User');
  const existing = await User.findOne({ email: "alamincomputers@gmail.com" });
  if (existing) {
    console.log('Admin already exists!');
    process.exit(0);
  }
  const hashed = await bcrypt.hash("Admin@123456", 10);
  await User.create({
    name: "Admin",
    email: "alamincomputers@gmail.com",
    password: hashed,
    role: "admin",
  });
  console.log('Admin created!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
