import express from "express";
import getReport from "../controllers/report.js";
import { protect, restrictTo } from "../controllers/user.js";

// Create a new router instance
const reportRouter = express.Router();

// CRUD routes - Protected
reportRouter.use(protect);
reportRouter.use(restrictTo("admin"));
reportRouter.route("/").get(getReport);

// Export the router
export default reportRouter;
