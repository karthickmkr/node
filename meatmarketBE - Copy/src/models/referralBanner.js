import mongoose from "mongoose";

// Define mongoose schema for referral banner
const referralBannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted referral banners
referralBannerSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for referral banner
const ReferralBanner = mongoose.model("ReferralBanner", referralBannerSchema);

export default ReferralBanner;
