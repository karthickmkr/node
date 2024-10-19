import mongoose from "mongoose";

// Define mongoose schema for product
const productSchema = new mongoose.Schema({
  productId: {
    unique: true,
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["chicken", "mutton"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  minWeightInGrams: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    required: true,
  },
  deliveryInfo: {
    type: String,
    required: true,
  },
  nutritionalInfo: {
    type: String,
    required: true,
  },

  // Optional fields
  pieceCount: {
    type: String,
    default: null,
  },
  discountInPercent: {
    type: Number,
    default: 0,
  },
  metaHeading: {
    type: String,
    trim: true,
  },
  metaContent: {
    type: String,
    trim: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted products
productSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for product
const Product = mongoose.model("Product", productSchema);

export default Product;
