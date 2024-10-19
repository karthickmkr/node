import express from "express";
import {
  getAllProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} from "./../controllers/product.js";
import { uploadImage } from "../utils/multerConfig.js";
import { protect, restrictTo } from "./../controllers/user.js";

// Create a new router instance
const productRouter = express.Router();

// CRUD routes - Protected
productRouter
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTo("admin"), uploadImage, createProduct);

// Search product
productRouter.route("/search").get(searchProduct);

// Slug routes
productRouter.route("/slug/:slug").get(getProductBySlug);

productRouter
  .route("/:id")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), uploadImage, updateProduct)
  .delete(protect, restrictTo("admin"), deleteProduct);

// Export the router
export default productRouter;
