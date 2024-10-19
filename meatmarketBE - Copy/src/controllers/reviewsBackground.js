import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import ReviewsBackground from "../models/reviewsBackground.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all reviews backgrounds
export const getAllReviewsBackgrounds = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(ReviewsBackground.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviewsBackgrounds = await features.query;

  const totalDocuments = await new APIFeatures(
    ReviewsBackground.find(),
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
    results: reviewsBackgrounds.length,
    reviewsBackgrounds,
  };

  // Return the reviews backgrounds
  res.status(200).json(response);
});

// Function to get a single reviews background
export const getReviewsBackground = catchAsync(async (req, res, next) => {
  const reviewsBackgroundId = req.params.id;

  // Find the reviews background by id
  const reviewsBackground = await ReviewsBackground.findById(
    reviewsBackgroundId
  );

  // Check if the reviews background exists
  if (!reviewsBackground) {
    return next(new AppError("Reviews background not found", 404));
  }

  // Return the reviews background
  res.status(200).json({ reviewsBackground });
});

// Function to create a reviews background
export const createReviewsBackground = catchAsync(async (req, res, next) => {
  req.body.image = req.file.filename;
  const reviewsBackground = await ReviewsBackground.create(req.body);
  // Return the created reviews background
  res.status(201).json({ reviewsBackground });
});

// Function to update a reviews background
export const updateReviewsBackground = catchAsync(async (req, res, next) => {
  const reviewsBackgroundId = req.params.id;
  if (req.file) {
    req.body.image = req.file.filename;
  }
  // Find the reviews background by id and update the details
  const reviewsBackground = await ReviewsBackground.findByIdAndUpdate(
    reviewsBackgroundId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Check if the reviews background exists
  if (!reviewsBackground) {
    return next(new AppError("Reviews background not found", 404));
  }

  // Return the updated reviews background
  res.status(200).json({ reviewsBackground });
});

// Function to delete a reviews background
export const deleteReviewsBackground = catchAsync(async (req, res, next) => {
  const reviewsBackgroundId = req.params.id;

  // Find the reviews background by id and delete it
  const reviewsBackground = await ReviewsBackground.findByIdAndUpdate(
    reviewsBackgroundId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the reviews background exists
  if (!reviewsBackground) {
    return next(new AppError("Reviews background not found", 404));
  }

  // Return the deleted reviews background
  res.status(204).json({ reviewsBackground });
});
