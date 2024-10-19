import mongoose from "mongoose";

// Define mongoose schema for nutrition banner
const nutritionBannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted nutrition banners
nutritionBannerSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for nutrition banner
const NutritionBanner = mongoose.model(
  "NutritionBanner",
  nutritionBannerSchema
);

export default NutritionBanner;
