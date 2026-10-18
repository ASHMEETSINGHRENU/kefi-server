import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: () => 'KEFI-' + Math.floor(1000 + Math.random() * 9000),
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        "Women's Wear",
        "Men's Wear",
        'Occasion Wear',
        'Bridal Couture',
        'Contemporary',
        'Everyday Elegance',
      ],
      default: "Women's Wear",
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ['None', 'Bestseller', 'New Arrival', 'Trending', 'Limited Edition', 'Haute Couture'],
      default: 'None',
    },
    fabric: {
      type: String,
      trim: true,
      default: 'Pure Silk & Chiffon',
    },
    colors: {
      type: [String],
      default: ['Blush Pink', 'Rose Gold'],
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Out of Stock'],
      default: 'Active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
