import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import BulkOrder from "../models/bulkOrder.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all bulk orders
export const getAllBulkOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(BulkOrder.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bulkOrders = await features.query;

  const totalDocuments = await new APIFeatures(
    BulkOrder.find(),
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
    results: bulkOrders.length,
    bulkOrders,
  };

  // Return the bulk orders
  res.status(200).json(response);
});

// Function to get a single bulk order
export const getBulkOrder = catchAsync(async (req, res, next) => {
  const bulkOrderId = req.params.id;

  // Find the bulk order by id
  const bulkOrder = await BulkOrder.findById(bulkOrderId);

  // Check if the bulk order exists
  if (!bulkOrder) {
    return next(new AppError("Bulk order not found", 404));
  }

  // Return the bulk order
  res.status(200).json({ bulkOrder });
});

// Function to create a bulk order
export const createBulkOrder = catchAsync(async (req, res, next) => {
  const bulkOrder = await BulkOrder.create(req.body);
  // Return the created bulk order
  res.status(201).json({ bulkOrder });
});

// Function to update a bulk order
export const updateBulkOrder = catchAsync(async (req, res, next) => {
  const bulkOrderId = req.params.id;

  // Find the bulk order by id and update the details
  const bulkOrder = await BulkOrder.findByIdAndUpdate(bulkOrderId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the bulk order exists
  if (!bulkOrder) {
    return next(new AppError("Bulk order not found", 404));
  }

  // Return the updated bulk order
  res.status(200).json({ bulkOrder });
});

// Function to delete a bulk order
export const deleteBulkOrder = catchAsync(async (req, res, next) => {
  const bulkOrderId = req.params.id;

  // Find the bulk order by id and delete it
  const bulkOrder = await BulkOrder.findByIdAndUpdate(
    bulkOrderId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the bulk order exists
  if (!bulkOrder) {
    return next(new AppError("Bulk order not found", 404));
  }

  // Return the deleted bulk order
  res.status(204).json({ bulkOrder });
});
