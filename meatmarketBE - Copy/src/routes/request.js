import express from "express";
import {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../controllers/request.js";
import { protect, restrictTo } from "../controllers/user.js";
import { uploadImage } from "../utils/multerConfig.js";

// Create a new router instance
const requestRouter = express.Router();

requestRouter
  .route("/")
  .get(protect, restrictTo("admin"), getAllRequests)
  .post(uploadImage, createRequest);

// CRUD routes - Protected
requestRouter.use(protect);
requestRouter.use(restrictTo("admin"));

requestRouter
  .route("/:id")
  .get(getRequest)
  .patch(uploadImage, updateRequest)
  .delete(deleteRequest);

// Export the router
export default requestRouter;
