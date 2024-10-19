import express from "express";
import { protect, restrictTo } from "../controllers/user.js";
import {
  createFranchise,
  login,
  logout,
  updatePassword,
  franchiseProtect,
  getAllFranchise,
  getCurrentFranchise,
  getFranchise,
  updateFranchise,
  deleteFranchise,
} from "../controllers/franchise.js";

import { getAllOrders, updateOrder } from "../controllers/order.js";

// Create a new router instance
const franchiseRouter = express.Router();

// Auth routes - admin
franchiseRouter.route("/").get(protect, restrictTo("admin"), getAllFranchise);
franchiseRouter
  .route("/auth")
  .post(protect, restrictTo("admin"), createFranchise);

// Auth routes - franchise
franchiseRouter.route("/auth/login").post(login);
franchiseRouter.route("/auth/logout").post(logout);
franchiseRouter
  .route("/auth/updatePassword")
  .patch(protect, restrictTo("admin"), updatePassword);

franchiseRouter.route("/getMe").get(franchiseProtect, getCurrentFranchise);

franchiseRouter.route("/order").get(franchiseProtect, getAllOrders);
franchiseRouter.route("/order/:id").patch(franchiseProtect, updateOrder);

franchiseRouter
  .route("/:id")
  .get(protect, restrictTo("admin"), getFranchise)
  .patch(protect, restrictTo("admin"), updateFranchise)
  .delete(protect, restrictTo("admin"), deleteFranchise);

// Export the router
export default franchiseRouter;
