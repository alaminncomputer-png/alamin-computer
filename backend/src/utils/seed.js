import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  { name: 'Business Laptops', slug: 'business', icon: '💼', description: 'HP EliteBook, Dell Latitude, Lenovo ThinkPad', order: 1 },
  { name: 'Gaming Laptops', slug: 'gaming', icon: '🎮', description: 'High-performance gaming machines', order: 2 },
  { name: 'Student Laptops', slug: 'student', icon: '🎓', description: 'Affordable, lightweight laptops for students', order: 3 },
  { name: 'Ultrabooks', slug: 'ultrabook', icon: '✨', description: 'Thin, lightweight, premium ultrabooks', order: 4 },
  { name: 'Workstations', slug: 'workstation', icon: '🖥️', description: 'High-end workstations for professionals', order: 5 },
  { name: 'Wholesale', slug: 'wholesale', icon: '📦', description: 'Bulk purchase for businesses', order: 6 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@alamincomputer.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin user created');
    }

    // Create categories
    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log('✅ Categories seeded');

    // Create sample products
    const bizCat = await Category.findOne({ slug: 'business' });
    const gamingCat = await Category.findOne({ slug: 'gaming' });
    const studentCat = await Category.findOne({ slug: 'student' });

    const sampleProducts = [
      {
        name: 'HP EliteBook 840 G8 Core i7',
        slug: 'hp-elitebook-840-g8-core-i7',
        description: 'Professional grade business laptop. Excellent condition, fully tested. Perfect for corporate use.',
        price: 45000,
        oldPrice: 55000,
        category: bizCat._id,
        specs: {
          processor: 'Intel Core i7-1165G7',
          processorGen: '11th Gen',
          ram: '16GB DDR4',
          storage: '512GB',
          storageType: 'SSD',
          display: '14" FHD IPS Anti-Glare',
          graphics: 'Intel Iris Xe Graphics',
          battery: '53Wh',
          batteryCondition: 'Excellent',
          os: 'Windows 11 Pro',
          weight: '1.37 kg',
        },
        condition: 'Refurbished',
        stock: 10,
        isFeatured: true,
        isBestSeller: true,
        tags: ['hp', 'elitebook', 'business', 'core i7', 'refurbished'],
        warranty: '6 months',
        images: [{ url: 'https://placehold.co/800x800/0a3aab/ffffff?text=HP+EliteBook+840', publicId: 'demo' }],
      },
      {
        name: 'Dell Latitude 5510 Core i5',
        slug: 'dell-latitude-5510-core-i5',
        description: 'Reliable business laptop from Dell. Great battery life and build quality.',
        price: 32000,
        oldPrice: 40000,
        category: bizCat._id,
        specs: {
          processor: 'Intel Core i5-10210U',
          processorGen: '10th Gen',
          ram: '8GB DDR4',
          storage: '256GB',
          storageType: 'SSD',
          display: '15.6" FHD',
          graphics: 'Intel UHD Graphics',
          battery: '68Wh',
          batteryCondition: 'Good',
          os: 'Windows 10 Pro',
          weight: '1.78 kg',
        },
        condition: 'Refurbished',
        stock: 15,
        isFeatured: true,
        tags: ['dell', 'latitude', 'business', 'core i5'],
        warranty: '3 months',
        images: [{ url: 'https://placehold.co/800x800/0d4fd4/ffffff?text=Dell+Latitude+5510', publicId: 'demo' }],
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon',
        slug: 'lenovo-thinkpad-x1-carbon-gen9',
        description: 'Ultra-lightweight premium business ultrabook. ThinkPad reliability at its best.',
        price: 65000,
        oldPrice: 80000,
        category: bizCat._id,
        specs: {
          processor: 'Intel Core i7-1185G7',
          processorGen: '11th Gen',
          ram: '16GB LPDDR4x',
          storage: '1TB',
          storageType: 'SSD',
          display: '14" 2K IPS',
          graphics: 'Intel Iris Xe Graphics',
          battery: '57Wh',
          batteryCondition: 'Excellent',
          os: 'Windows 11 Pro',
          weight: '1.13 kg',
        },
        condition: 'Refurbished',
        stock: 5,
        isFeatured: true,
        isBestSeller: true,
        tags: ['lenovo', 'thinkpad', 'ultrabook', 'premium'],
        warranty: '6 months',
        images: [{ url: 'https://placehold.co/800x800/1a6bff/ffffff?text=ThinkPad+X1+Carbon', publicId: 'demo' }],
      },
      {
        name: 'Acer Aspire 5 Student Laptop',
        slug: 'acer-aspire-5-student',
        description: 'Affordable and reliable student laptop. Great for assignments, browsing, and everyday tasks.',
        price: 18000,
        oldPrice: 22000,
        category: studentCat._id,
        specs: {
          processor: 'Intel Core i3-1115G4',
          processorGen: '11th Gen',
          ram: '8GB DDR4',
          storage: '256GB',
          storageType: 'SSD',
          display: '15.6" FHD',
          graphics: 'Intel UHD Graphics',
          battery: '48Wh',
          batteryCondition: 'Good',
          os: 'Windows 11 Home',
          weight: '1.8 kg',
        },
        condition: 'Refurbished',
        stock: 20,
        isNewArrival: true,
        tags: ['acer', 'student', 'affordable', 'budget'],
        warranty: '3 months',
        images: [{ url: 'https://placehold.co/800x800/0b1527/00d4ff?text=Acer+Aspire+5', publicId: 'demo' }],
      },
      {
        name: 'ASUS ROG Strix G15 Gaming',
        slug: 'asus-rog-strix-g15-gaming',
        description: 'High-performance gaming laptop. GTX 1650 graphics for smooth gaming experience.',
        price: 72000,
        oldPrice: 90000,
        category: gamingCat._id,
        specs: {
          processor: 'AMD Ryzen 7 4800H',
          processorGen: 'Ryzen 4000',
          ram: '16GB DDR4',
          storage: '512GB',
          storageType: 'SSD',
          display: '15.6" FHD 144Hz',
          graphics: 'NVIDIA GTX 1650 4GB',
          battery: '66Wh',
          batteryCondition: 'Good',
          os: 'Windows 11 Home',
          weight: '2.3 kg',
        },
        condition: 'Refurbished',
        stock: 7,
        isFeatured: true,
        isBestSeller: true,
        tags: ['asus', 'rog', 'gaming', 'ryzen'],
        warranty: '3 months',
        images: [{ url: 'https://placehold.co/800x800/04080f/1a6bff?text=ROG+Strix+G15', publicId: 'demo' }],
      },
    ];

    for (const prod of sampleProducts) {
      await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true, new: true });
    }
    console.log('✅ Sample products seeded');
    console.log('\n🎉 Database seeded successfully!');
    console.log(`📧 Admin: ${process.env.ADMIN_EMAIL || 'admin@alamincomputer.com'}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
