import express from "express";
import { checkoutSession, webhook } from "../controllers/payment.js";

const paymentRouter = express.Router();

// Payment routes
paymentRouter.route("/checkout-session").post(checkoutSession);
paymentRouter.route("/webhook").post(webhook);

export default paymentRouter;
