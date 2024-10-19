import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import NutritionBanner from "../models/nutritionBanner.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all nutrition banners
export const getAllNutritionBanners = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(NutritionBanner.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const nutritionBanners = await features.query;

  const totalDocuments = await new APIFeatures(
    NutritionBanner.find(),
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
    results: nutritionBanners.length,
    nutritionBanners,
  };

  // Return the nutrition banners
  res.status(200).json(response);
});

// Function to get a single nutrition banner
export const getNutritionBanner = catchAsync(async (req, res, next) => {
  const nutritionBannerId = req.params.id;

  // Find the nutrition banner by id
  const nutritionBanner = await NutritionBanner.findById(nutritionBannerId);

  // Check if the nutrition banner exists
  if (!nutritionBanner) {
    return next(new AppError("Nutrition banner not found", 404));
  }

  // Return the nutrition banner
  res.status(200).json({ nutritionBanner });
});

// Function to create a nutrition banner
export const createNutritionBanner = catchAsync(async (req, res, next) => {
  req.body.image = req.file.filename;
  const nutritionBanner = await NutritionBanner.create(req.body);
  // Return the created nutrition banner
  res.status(201).json({ nutritionBanner });
});

// Function to update a nutrition banner
export const updateNutritionBanner = catchAsync(async (req, res, next) => {
  const nutritionBannerId = req.params.id;
  if (req.file) {
    req.body.image = req.file.filename;
  }

  // Find the nutrition banner by id and update the details
  const nutritionBanner = await NutritionBanner.findByIdAndUpdate(
    nutritionBannerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Check if the nutrition banner exists
  if (!nutritionBanner) {
    return next(new AppError("Nutrition banner not found", 404));
  }

  // Return the updated nutrition banner
  res.status(200).json({ nutritionBanner });
});

// Function to delete a nutrition banner
export const deleteNutritionBanner = catchAsync(async (req, res, next) => {
  const nutritionBannerId = req.params.id;

  // Find the nutrition banner by id and delete it
  const nutritionBanner = await NutritionBanner.findByIdAndUpdate(
    nutritionBannerId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the nutrition banner exists
  if (!nutritionBanner) {
    return next(new AppError("Nutrition banner not found", 404));
  }

  // Return the deleted nutrition banner
  res.status(204).json({ nutritionBanner });
});
