import express from "express";

import userRouter from "./routes/user.js";
import paymentRouter from "./routes/payment.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import bulkOrderRouter from "./routes/bulkOrder.js";
import transactionRouter from "./routes/transaction.js";
import requestRouter from "./routes/request.js";
import reportRouter from "./routes/report.js";
import reviewRouter from "./routes/review.js";
import franchiseRouter from "./routes/franchise.js";

// CMS imports
import heroPageRouter from "./routes/heroPage.js";
import nutritionBannerRouter from "./routes/nutritionBanner.js";
import reviewsBackgroundRouter from "./routes/reviewsBackground.js";
import referralBannerRouter from "./routes/referralBanner.js";
import videoRouter from "./routes/video.js";

// Create a new router instance
const router = express.Router();

router.use("/payment", paymentRouter);

router.use("/user", userRouter);

router.use("/product", productRouter);

router.use("/order", orderRouter);

router.use("/bulkOrder", bulkOrderRouter);

router.use("/transaction", transactionRouter);

router.use("/request", requestRouter);

router.use("/report", reportRouter);

router.use("/review", reviewRouter);

router.use("/franchise", franchiseRouter);

// CMS routes
router.use("/heroPage", heroPageRouter);
router.use("/nutritionBanner", nutritionBannerRouter);
router.use("/reviewsBackground", reviewsBackgroundRouter);
router.use("/referralBanner", referralBannerRouter);
router.use("/video", videoRouter);

// Export the router
export default router;
