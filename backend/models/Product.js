const mongoose = require('mongoose');

const specSchema = new mongoose.Schema({
  processor: { type: String, default: 'N/A' },
  ram: { type: String, default: 'N/A' },
  storage: { type: String, default: 'N/A' },
  storageType: { type: String, enum: ['SSD', 'HDD', 'eMMC', 'NVMe SSD'], default: 'SSD' },
  display: { type: String, default: 'N/A' },
  graphics: { type: String, default: 'Integrated' },
  battery: { type: String, default: 'N/A' },
  batteryHealth: { type: Number, min: 0, max: 100, default: 100 },
  os: { type: String, default: 'Windows 11' },
  weight: { type: String },
  ports: [String],
  wireless: { type: String, default: 'Wi-Fi + Bluetooth' },
  camera: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000],
    },
    shortDescription: { type: String, maxlength: 300 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: { type: String, required: true, trim: true },
    model: { type: String, trim: true },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
      default: 'Like New',
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String, default: '' },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: { type: Number, default: null },
    wholesalePrice: { type: Number, default: null },
    wholesaleMinQty: { type: Number, default: 5 },
    currency: { type: String, default: 'ETB' },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    sold: { type: Number, default: 0 },
    specifications: specSchema,
    tags: [{ type: String, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isStudentPick: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    warranty: { type: String, default: '3 months' },
    returnPolicy: { type: String, default: '7 days' },
    weight: { type: Number }, // in grams for shipping
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    views: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice || this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
