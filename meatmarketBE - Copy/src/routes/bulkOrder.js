import express from "express";
import {
  getAllBulkOrders,
  getBulkOrder,
  createBulkOrder,
  updateBulkOrder,
  deleteBulkOrder,
} from "../controllers/bulkOrder.js";
import { protect, restrictTo } from "../controllers/user.js";

// Create a new router instance
const bulkOrderRouter = express.Router();

// CRUD routes - Protected
bulkOrderRouter.use(protect);
bulkOrderRouter
  .route("/")
  .get(restrictTo("admin"), getAllBulkOrders)
  .post(createBulkOrder);

bulkOrderRouter
  .route("/:id")
  .get(getBulkOrder)
  .patch(updateBulkOrder)
  .delete(restrictTo("admin"), deleteBulkOrder);

// Export the router
export default bulkOrderRouter;
