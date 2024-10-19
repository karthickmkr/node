import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import ReferralBanner from "../models/referralBanner.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all referral banners
export const getAllReferralBanners = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(ReferralBanner.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const referralBanners = await features.query;

  const totalDocuments = await new APIFeatures(
    ReferralBanner.find(),
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
    results: referralBanners.length,
    referralBanners,
  };

  // Return the referral banners
  res.status(200).json(response);
});

// Function to get a single referral banner
export const getReferralBanner = catchAsync(async (req, res, next) => {
  const referralBannerId = req.params.id;

  // Find the referral banner by id
  const referralBanner = await ReferralBanner.findById(referralBannerId);

  // Check if the referral banner exists
  if (!referralBanner) {
    return next(new AppError("Referral banner not found", 404));
  }

  // Return the referral banner
  res.status(200).json({ referralBanner });
});

// Function to create a referral banner
export const createReferralBanner = catchAsync(async (req, res, next) => {
  req.body.image = req.file.filename;
  const referralBanner = await ReferralBanner.create(req.body);
  // Return the created referral banner
  res.status(201).json({ referralBanner });
});

// Function to update a referral banner
export const updateReferralBanner = catchAsync(async (req, res, next) => {
  const referralBannerId = req.params.id;

  if (req.file) {
    req.body.image = req.file.filename;
  }

  // Find the referral banner by id and update the details
  const referralBanner = await ReferralBanner.findByIdAndUpdate(
    referralBannerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Check if the referral banner exists
  if (!referralBanner) {
    return next(new AppError("Referral banner not found", 404));
  }

  // Return the updated referral banner
  res.status(200).json({ referralBanner });
});

// Function to delete a referral banner
export const deleteReferralBanner = catchAsync(async (req, res, next) => {
  const referralBannerId = req.params.id;

  // Find the referral banner by id and delete it
  const referralBanner = await ReferralBanner.findByIdAndUpdate(
    referralBannerId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the referral banner exists
  if (!referralBanner) {
    return next(new AppError("Referral banner not found", 404));
  }

  // Return the deleted referral banner
  res.status(204).json({ referralBanner });
});
