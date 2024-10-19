import express from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";
import { protect, restrictTo } from "../controllers/user.js";

// Create a new router instance
const orderRouter = express.Router();

// CRUD routes - Protected
orderRouter.use(protect);
orderRouter.route("/").get(restrictTo("admin"), getAllOrders).post(createOrder);

orderRouter
  .route("/:id")
  .get(getOrder)
  .patch(updateOrder)
  .delete(restrictTo("admin"), deleteOrder);

// Export the router
export default orderRouter;
