import jwt from "jsonwebtoken";
import Franchise from "../models/franchise.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import APIFeatures from "../utils/ApiFeatures.js";

// Cookie options
const cookieExpiresIn = parseInt(process.env.COOKIE_EXPIRES_IN);
const cookieOptions = {
  expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
  httpOnly: false,
  secure: true,
  sameSite: "none",
};

// Function to sign the JWT token
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const signToken = (franchiseId) => {
  return jwt.sign({ franchiseId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

// Function to handle franchise login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the franchise exists
  const franchise = await Franchise.findOne({ email }).select("+password");
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  // Check if the password is correct
  const isPasswordValid = await franchise.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid password", 401));
  }

  // Generate JWT token
  const token = signToken(franchise._id);

  // Set the token as a cookie
  res.cookie("token", token, cookieOptions);

  // Return success response
  res
    .status(200)
    .json({ message: "Login successful", token, role: franchise.role });
});

export const createFranchise = catchAsync(async (req, res, next) => {
  // Check if the franchise already exists
  const existingFranchise = await Franchise.findOne({ email: req.body.email });
  if (existingFranchise) {
    return next(new AppError("Franchise already exists", 400));
  }

  // Create a new franchise
  const newFranchise = new Franchise(req.body);
  await newFranchise.save();

  // Return success response
  res.status(201).json({ message: "Franchise Created Successfully" });
});

// Function to handle protected route
export const franchiseProtect = catchAsync(async (req, res, next) => {
  // Check if the franchise is logged in
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // Verify the JWT token
  const decodedToken = jwt.verify(token, jwtSecret);
  const franchiseId = decodedToken.franchiseId;

  // Check if the franchise exists
  const franchise = await Franchise.findById(franchiseId);
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  // Check if the franchise changed the password after the token was issued
  if (franchise.changedPasswordAfter(decodedToken.iat)) {
    return next(new AppError("Franchise recently changed password", 401));
  }

  // Attach the franchise object to the request
  req.franchise = franchise;

  // Continue to the next middleware
  next();
});

// Function to get the current franchise
export const getCurrentFranchise = catchAsync(async (req, res, next) => {
  // Return the franchise object
  res.status(200).json({ franchise: req.franchise });
});

// Function to handle franchise logout
export const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");

  // Return success response
  res.status(200).json({ message: "Logout successful" });
};

// Function to restrict routes by role
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the franchise's role is allowed
    if (req.franchise && !roles.includes(req.franchise.role)) {
      return next(new AppError("You do not have permission", 403));
    }

    // Continue to the next middleware
    next();
  };
};

// Function to update the password
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Check if the current password is correct
  const franchise = await Franchise.findById(req.franchise?._id).select(
    "+password"
  );
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  const isPasswordValid = await franchise.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return next(new AppError("Invalid password", 401));
  }

  // Update the password
  franchise.password = newPassword;
  await franchise.save();

  // Return success response
  res.status(200).json({ message: "Password update successful" });
});

// Function to get all franchises
export const getAllFranchise = catchAsync(async (req, res, next) => {
  // Fetch all franchises from the database
  const features = new APIFeatures(Franchise.find(), req.query) // Cast req.query to QueryString type

    .filter()
    .sort()
    .limitFields();
  // .paginate();

  const franchises = await features.query;

  // const totalDocuments = await new APIFeatures(
  //   Franchise.find(),
  //   req.query
  // ).countDocuments();

  // const page = req.query.page ? parseInt(req.query.page) : 1;
  // const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  // const totalPages = Math.ceil(totalDocuments / limit);

  // const response = {
  //   page,
  //   perPage: limit,
  //   totalPages,
  //   totalResults: totalDocuments,
  //   results: franchises.length,
  //   franchises,
  // };

  // Return the franchises
  res.status(200).json({ franchises });
});

// Function to get a single franchise
export const getFranchise = catchAsync(async (req, res, next) => {
  const franchiseId = req.params.id;

  // Find the franchise by id
  const franchise = await Franchise.findById(franchiseId);

  // Check if the franchise exists
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  // Return the franchise
  res.status(200).json({ franchise });
});

// Function to update a franchise
export const updateFranchise = catchAsync(async (req, res, next) => {
  // Check if the franchise is trying to update the password
  if (req.body.password) {
    return next(new AppError("This route is not for password updates", 400));
  }

  const franchiseId = req.params.id;

  // Find the franchise by id and update the details
  const franchise = await Franchise.findByIdAndUpdate(franchiseId, req.body, {
    new: true,
  });

  // Check if the franchise exists
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  // Return the updated franchise
  res.status(200).json({ franchise });
});

// Function to delete a franchise
export const deleteFranchise = catchAsync(async (req, res, next) => {
  const franchiseId = req.params.id;

  // Find the franchise by id and delete it
  const franchise = await Franchise.findByIdAndUpdate(
    franchiseId,
    { isDeleted: true },
    { new: true }
  );

  // Check if the franchise exists
  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  // Return the deleted franchise
  res.status(204).json({ franchise });
});
