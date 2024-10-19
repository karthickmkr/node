import mongoose from "mongoose";

// Define mongoose schema for bulkOrder
const bulkOrderSchema = new mongoose.Schema({
  deliveryDate: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  //Optional fields
  chickenWeight: {
    type: Number,
    default: null,
  },
  muttonWeight: {
    type: Number,
    default: null,
  },
  approval: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted bulkOrders
bulkOrderSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create the bulkOrder model
const BulkOrder = mongoose.model("BulkOrder", bulkOrderSchema);

export default BulkOrder;
