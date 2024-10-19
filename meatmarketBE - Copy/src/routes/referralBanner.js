import express from "express";
import {
  getAllReferralBanners,
  getReferralBanner,
  createReferralBanner,
  updateReferralBanner,
  deleteReferralBanner,
} from "../controllers/referralBanner.js";
import { protect, restrictTo } from "../controllers/user.js";
import { uploadImage } from "../utils/multerConfig.js";
const referralBannerRouter = express.Router();

referralBannerRouter
  .route("/")
  .get(getAllReferralBanners)
  .post(protect, restrictTo("admin"), uploadImage, createReferralBanner);

referralBannerRouter
  .route("/:id")
  .get(getReferralBanner)
  .patch(protect, restrictTo("admin"), uploadImage, updateReferralBanner)
  .delete(protect, restrictTo("admin"), deleteReferralBanner);

export default referralBannerRouter;
