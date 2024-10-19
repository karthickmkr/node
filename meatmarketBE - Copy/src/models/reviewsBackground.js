import mongoose from "mongoose";

// Define mongoose schema for reviews background
const reviewsBackgroundSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted reviews backgrounds
reviewsBackgroundSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for reviews background
const ReviewsBackground = mongoose.model(
  "ReviewsBackground",
  reviewsBackgroundSchema
);

export default ReviewsBackground;
