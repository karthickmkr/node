import express from "express";
import {
  getAllNutritionBanners,
  getNutritionBanner,
  createNutritionBanner,
  updateNutritionBanner,
  deleteNutritionBanner,
} from "../controllers/nutritionBanner.js";
import { protect, restrictTo } from "../controllers/user.js";
import { uploadImage } from "../utils/multerConfig.js";
const nutritionBannerRouter = express.Router();

nutritionBannerRouter
  .route("/")
  .get(getAllNutritionBanners)
  .post(protect, restrictTo("admin"), uploadImage, createNutritionBanner);

nutritionBannerRouter
  .route("/:id")
  .get(getNutritionBanner)
  .patch(protect, restrictTo("admin"), uploadImage, updateNutritionBanner)
  .delete(protect, restrictTo("admin"), deleteNutritionBanner);

export default nutritionBannerRouter;
