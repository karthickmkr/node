import multer, { MulterError } from "multer";
import AppError from "./AppError.js";

import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer error handler
const throwMulterError = (err, next) => {
  // Handle Multer errors
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("File size must be less than 5MB", 400));
    }
    return next(new AppError("Error Uploading file", 400));
  }
  // Handle other errors
  return next(new AppError(err.message, 400));
};

// Define the storage configuration for disk storage
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Define the storage configuration for disk storage
const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../public/videos"));
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Define the file filter function for image validation
const fileFilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Define the file filter function for video validation
const fileFilterVideo = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

// Create the Multer middleware instance
const uploadImageMulter = multer({
  storage: storageImage,
  fileFilter: fileFilterImage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Create the Multer middleware instance
const uploadVideoMulter = multer({
  storage: storageVideo,
  fileFilter: fileFilterVideo,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Define the route handler that uses the Multer middleware
const uploadImage = (req, res, next) => {
  uploadImageMulter.single("image")(req, res, (err) => {
    if (err) throwMulterError(err, next);
    if (!req.file) {
      if (req.method === "PATCH") return next();
      return next(new AppError("Please upload an image", 400));
    }

    // Create a unique filename
    req.file.originalname = uuidv4();
    next();
  });
};

const uploadMultipleImages = (req, res, next) => {
  uploadImageMulter.fields([
    { name: "image", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) throwMulterError(err, next);
    if (!req.files || !req.files.image || !req.files.background) {
      if (req.method === "PATCH") return next();
      return next(new AppError("Please upload both images", 400));
    }

    // Create unique filenames
    req.files.image[0].originalname = uuidv4();
    req.files.background[0].originalname = uuidv4();

    next();
  });
};
const uploadVideo = (req, res, next) => {
  uploadVideoMulter.single("video")(req, res, (err) => {
    if (err) throwMulterError(err, next);
    if (!req.file) {
      return next(new AppError("Please upload a video", 400));
    }

    // Create a unique filename
    req.file.originalname = uuidv4();
    next();
  });
};

export { uploadImage, uploadMultipleImages, uploadVideo };
