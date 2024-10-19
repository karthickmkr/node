import mongoose, { Schema } from "mongoose";

// Define mongoose schema for order
const orderSchema = new mongoose.Schema({
  orderId: {
    unique: true,
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lineItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },

  type: {
    type: String,
    enum: ["normal", "semi clean", "full clean"],
    required: true,
  },
  deliverySlot: {
    type: String,
    enum: ["07:00am-11:00am", "05:00pm-09:00pm"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "cash"],
    required: true,
  },

  //Optional fields
  assignedFranchise: {
    type: Schema.Types.ObjectId,
    ref: "Franchise",
    default: null,
  },
  deliveryDate: {
    type: Date,
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "out for delivery", "completed"],
    default: "pending",
  },
  deliveryInstructions: {
    type: String,
    default: null,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancellationReason: {
    type: String,
    default: null,
  },
  cancellationDate: {
    type: Date,
    default: null,
  },
  refundStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-find middleware to filter out deleted orders
orderSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Create the order model
const Order = mongoose.model("Order", orderSchema);

export default Order;
