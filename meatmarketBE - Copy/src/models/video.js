import mongoose from "mongoose";

// Define mongoose schema for video
const videoSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted video
videoSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for video
const Video = mongoose.model("Video", videoSchema);

export default Video;
