import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Video from "../models/video.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Function to get all videos
export const getAllVideos = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Video.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const videos = await features.query;

  const totalDocuments = await new APIFeatures(
    Video.find(),
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
    results: videos.length,
    videos,
  };

  // Return the videos
  res.status(200).json(response);
});

// Function to get a single video
export const getVideo = catchAsync(async (req, res, next) => {
  const videoId = req.params.id;

  // Find the video by id
  const video = await Video.findById(videoId);

  // Check if the video exists
  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Return the video
  res.status(200).json({ video });
});

// Function to create a video
export const createVideo = catchAsync(async (req, res, next) => {
  req.body.video = req.file.filename;
  const video = await Video.create(req.body);
  // Return the created video
  res.status(201).json({ video });
});

// Function to update a video
export const updateVideo = catchAsync(async (req, res, next) => {
  const videoId = req.params.id;

  if (req.file) {
    req.body.video = req.file.filename;
  }

  // Find the video by id and update the details
  const video = await Video.findByIdAndUpdate(videoId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the video exists
  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Return the updated video
  res.status(200).json({ video });
});

// Function to delete a video
export const deleteVideo = catchAsync(async (req, res, next) => {
  const videoId = req.params.id;

  // Find the video by id and delete it
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the video exists
  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Return the deleted video
  res.status(204).json({ video });
});
