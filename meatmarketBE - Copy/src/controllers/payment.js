import Stripe from "stripe";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const currency = process.env.STRIPE_CURRENCY;
const currencyUnitAmount = process.env.STRIPE_CURRENCY_UNIT_AMOUNT;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const paymentSuccessUrl = process.env.STRIPE_PAYMENT_SUCCESS_URL;
const paymentCancelUrl = process.env.STRIPE_PAYMENT_CANCEL_URL;
const stripe = new Stripe(stripeSecretKey);

// Create a checkout session
const createCheckoutSession = async (rawLineItems, order, user) => {
  try {
    //building line items
    const lineItems = rawLineItems.map((lineItem) => {
      return {
        price_data: {
          currency,
          product_data: {
            name: lineItem.product.name,
            description: lineItem.product.description,
            images: [lineItem.product.image],
          },
          unit_amount: lineItem.product.price * currencyUnitAmount,
        },
        quantity: lineItem.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      billing_address_collection: "auto",
      line_items: lineItems,
      mode: "payment",
      success_url: paymentSuccessUrl,
      cancel_url: paymentCancelUrl,
      metadata: {
        userId: user._id.toString(),
        orderId: order._id.toString(),
      },
    });

    return session;
  } catch (error) {
    throw new Error("Failed to create checkout session");
  }
};

const checkoutSession = catchAsync(async (req, res, next) => {
  const { orderId, userId } = req.body;
  const user = await User.findById(userId);
  const order = await Order.findById(orderId);
  const rawLineItems = order.lineItems;
  //populating product details
  for (let i = 0; i < rawLineItems.length; i++) {
    rawLineItems[i].product = await Product.findById(rawLineItems[i].product);
  }
  const session = await createCheckoutSession(rawLineItems, order, user);
  res.status(200).json({ checkout: session.url });
});

const webhook = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return next(new AppError("Signature not found", 400));
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    return next(new AppError(`Webhook Error: ${err.message}`, 400));
  }
  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    // Retrieve metadata
    const metadata = event.data.object.metadata;
    const unitAmountTotal = event.data.object.amount_total;
    const amount = unitAmountTotal / currencyUnitAmount;

    //update payment status in order
    await Order.findByIdAndUpdate(metadata.orderId, {
      paymentStatus: "paid",
      paymentAmount: amount,
    });

    // Create a transaction
    await Transaction.create({
      order: metadata.orderId,
      user: metadata.userId,
      amount: amount,
    });
  }

  res.status(200).end();
});

export { checkoutSession, webhook };
