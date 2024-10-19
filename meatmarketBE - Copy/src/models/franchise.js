import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const franchiseSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  passwordChangedAt: Date,
  address: {
    type: String,
    required: true,
  },
  // Optional fields
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

// Hash the password before saving
franchiseSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Add a method to update passwordChangedAt property
franchiseSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
  next();
});

// Query middleware
franchiseSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Add a method to compare passwords
franchiseSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Add a method to check if the password was changed after the token was issued
franchiseSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create the franchise model
const Franchise = mongoose.model("Franchise", franchiseSchema);

export default Franchise;
