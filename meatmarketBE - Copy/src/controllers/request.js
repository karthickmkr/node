import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Request from "../models/request.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all requests
export const getAllRequests = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Request.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const requests = await features.query;

  const totalDocuments = await new APIFeatures(
    Request.find(),
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
    results: requests.length,
    requests,
  };

  // Return the requests
  res.status(200).json(response);
});

// Function to get a single request
export const getRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;

  // Find the request by id
  const request = await Request.findById(requestId);

  // Check if the request exists
  if (!request) {
    return next(new AppError("Request not found", 404));
  }

  // Return the request
  res.status(200).json({ request });
});

// Function to create a request
export const createRequest = catchAsync(async (req, res, next) => {
  req.body.image = req.file.filename;
  const request = await Request.create(req.body);
  // Return the created request
  res.status(201).json({ request });
});

// Function to update a request
export const updateRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;

  // Find the request by id and update the details
  const request = await Request.findByIdAndUpdate(requestId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the request exists
  if (!request) {
    return next(new AppError("Request not found", 404));
  }

  // Return the updated request
  res.status(200).json({ request });
});

// Function to delete a request
export const deleteRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;

  // Find the request by id and delete it
  const request = await Request.findByIdAndUpdate(
    requestId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the request exists
  if (!request) {
    return next(new AppError("Request not found", 404));
  }

  // Return the deleted request
  res.status(204).json({ request });
});
