import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import router from "./routes.js";

// Import AppError && errorHandler
import AppError from "./utils/AppError.js";
import errorHandler from "./utils/errorHandler.js";

// Create a new express application instance
const app = express();

// Enable CORS
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: ['https://www.meatmarket.live',"http://localhost:3000","https://dashboard.meatmarket.live","https://partner.meatmarket.live"], // Allow all origins
    credentials: true,
  })
);



// Serve static files
app.use(express.static("public"));

// Set security HTTP headers
app.use(helmet());

// Middleware
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Routes
app.use("/api", router);

// Invalid route handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handler
app.use(errorHandler);

// Export the app
export default app;
