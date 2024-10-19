import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Review from "../models/review.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all reviews
export const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query
    .populate({
      path: "user",
      select: "name email phone gender",
    })
    .populate({
      path: "product",
      select: "name price image description",
    });

  const totalDocuments = await new APIFeatures(
    Review.find(),
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
    results: reviews.length,
    reviews,
  };

  // Return the reviews
  res.status(200).json(response);
});

// Function to get a single review
export const getReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  // Find the review by id
  const review = await Review.findById(reviewId);

  // Check if the review exists
  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Return the review
  res.status(200).json({ review });
});

// Function to create a review
export const createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  // Return the created review
  res.status(201).json({ review });
});

// Function to update a review
export const updateReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  // Find the review by id and update the details
  const review = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the review exists
  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Return the updated review
  res.status(200).json({ review });
});

// Function to delete a review
export const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  // Find the review by id and delete it
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the review exists
  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Return the deleted review
  res.status(204).json({ review });
});
