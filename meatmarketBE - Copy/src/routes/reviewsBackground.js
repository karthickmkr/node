import express from "express";
import {
  getAllReviewsBackgrounds,
  getReviewsBackground,
  createReviewsBackground,
  updateReviewsBackground,
  deleteReviewsBackground,
} from "../controllers/reviewsBackground.js";
import { protect, restrictTo } from "../controllers/user.js";
import { uploadImage } from "../utils/multerConfig.js";
const reviewsBackgroundRouter = express.Router();

reviewsBackgroundRouter
  .route("/")
  .get(getAllReviewsBackgrounds)
  .post(protect, restrictTo("admin"), uploadImage, createReviewsBackground);

reviewsBackgroundRouter
  .route("/:id")
  .get(getReviewsBackground)
  .patch(protect, restrictTo("admin"), uploadImage, updateReviewsBackground)
  .delete(protect, restrictTo("admin"), deleteReviewsBackground);

export default reviewsBackgroundRouter;
