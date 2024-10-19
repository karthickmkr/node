import { v4 as uuidv4 } from "uuid";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Product from "../models/product.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all products
export const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  const totalDocuments = await new APIFeatures(
    Product.find(),
    req.query
  ).countDocuments();

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const totalPages = Math.ceil(totalDocuments / limit);

  const response = {
    page,
    perPage: limit,
    totalPages,
    totalResults: totalDocuments,
    results: products.length,
    products,
  };

  // Return the products
  res.status(200).json(response);
});

// Function to get a single product
export const getProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  // Find the product by id
  const product = await Product.findById(productId);

  // Check if the product exists
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Return the product
  res.status(200).json({ product });
});

export const getProductBySlug = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;

  // Find the product by slug
  const product = await Product.findOne({ slug });

  // Check if the product exists
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Return the product
  res.status(200).json({ product });
});

// Function to create a product
export const createProduct = catchAsync(async (req, res, next) => {
  req.body.image = req.file.filename;
  req.body.productId = uuidv4();
  const product = await Product.create(req.body);
  // Return the created product
  res.status(201).json({ product });
});

// Function to update a product
export const updateProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  if (req.file) {
    req.body.image = req.file.filename;
  }

  // Find the product by id and update the details
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the product exists
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Return the updated product
  res.status(200).json({ product });
});

// Function to delete a product
export const deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  // Find the product by id and delete it
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the product exists
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Return the deleted product
  res.status(204).json({ product });
});

// Controller function for product search by name
export const searchProduct = catchAsync(async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new AppError("Please provide a name", 400));
  }

  // Perform case-insensitive search for products containing the name
  const products = await Product.find({
    name: { $regex: new RegExp(name, "i") },
  });

  res.status(200).json({ products });
});
