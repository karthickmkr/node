import mongoose from "mongoose";

// Define mongoose schema for hero page
const heroPageSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isTemporary: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted hero pages
heroPageSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for hero page
const HeroPage = mongoose.model("HeroPage", heroPageSchema);

export default HeroPage;
