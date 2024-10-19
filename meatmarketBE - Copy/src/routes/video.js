import express from "express";
import {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/video.js";
import { protect, restrictTo } from "../controllers/user.js";
import { uploadVideo } from "../utils/multerConfig.js";
const videoRouter = express.Router();

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(protect, restrictTo("admin"), uploadVideo, createVideo);

videoRouter
  .route("/:id")
  .get(getVideo)
  .patch(protect, restrictTo("admin"), uploadVideo, updateVideo)
  .delete(protect, restrictTo("admin"), deleteVideo);

export default videoRouter;
