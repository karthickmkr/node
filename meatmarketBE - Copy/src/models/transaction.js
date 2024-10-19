import mongoose, { Schema } from "mongoose";

// Define mongoose schema for transaction
const transactionSchema = new mongoose.Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  // Optional fields
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted transactions
transactionSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create model for transaction
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
