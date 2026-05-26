import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ url: String, publicId: String }],
    // Laptop Specs
    specs: {
      processor: String,
      processorGen: String,
      ram: String,
      storage: String,
      storageType: { type: String, enum: ['SSD', 'HDD', 'eMMC'], default: 'SSD' },
      display: String,
      graphics: String,
      battery: String,
      batteryCondition: { type: String, enum: ['New', 'Excellent', 'Good', 'Fair'], default: 'Good' },
      os: String,
      weight: String,
      ports: [String],
    },
    condition: { type: String, enum: ['New', 'Refurbished', 'Used-Excellent', 'Used-Good'], default: 'Refurbished' },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    customerType: {
      type: String,
      enum: ['all', 'wholesale', 'retail'],
      default: 'all',
    },
    wholesalePrice: Number,
    minWholesaleQty: { type: Number, default: 5 },
    warranty: { type: String, default: '3 months' },
    isActive: { type: Boolean, default: true },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true }
);

// Auto-calculate discount
productSchema.pre('save', function (next) {
  if (this.oldPrice && this.price && this.oldPrice > this.price) {
    this.discount = Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  next();
});

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text', 'specs.processor': 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });

export default mongoose.model('Product', productSchema);
