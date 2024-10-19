import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import APIFeatures from "../utils/ApiFeatures.js";
import sendEmail from "../utils/email.js";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get all orders
export const getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  // .paginate();

  const orders = await features.query
    .populate({
      path: "user",
      select: "name email phone",
    })
    .populate({
      path: "lineItems.product",
      select: "name price image description",
    });

  // const totalDocuments = await new APIFeatures(
  //   Order.find(),
  //   req.query
  // ).countDocuments();

  // const page = req.query.page ? parseInt(req.query.page) : 1;
  // const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  // const totalPages = Math.ceil(totalDocuments / limit);

  const response = {
    // page,
    // perPage: limit,
    // totalPages,
    // totalResults: totalDocuments,
    results: orders.length,
    orders,
  };

  // Return the orders
  res.status(200).json(response);
});

// Function to get a single order
export const getOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  // Find the order by id
  const order = await Order.findById(orderId)
    .populate({
      path: "user",
      select: "name email phone",
    })
    .populate({
      path: "lineItems.product",
      select: "name price image description",
    });

  // Check if the order exists
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Return the order
  res.status(200).json({ order });
});

const makeLineItemsTemplate = async (order) => {
  //pre populate the line items
  const promises = order.lineItems.map(async (item) => {
    item.product = await Product.findById(item.product);
    return item;
  });

  order.lineItems = await Promise.all(promises);

  let lineItemsHtml = "";
  let totalAmount = 0;

  order.lineItems.forEach(async (item, index) => {
    const product = item.product;
    const productName = product.name;
    const productPrice = product.price;
    const amount = productPrice * item.quantity;
    totalAmount += amount;

    lineItemsHtml += `
       <tr>
         <td>${index + 1}</td>
         <td>${productName}</td>
         <td>${item.quantity}</td>
         <td>${amount}</td>
       </tr>
     `;
  });

  const deliveryCharge = "Free";

  lineItemsHtml += `
     <tr>
       <td></td>
       <td></td>
       <td>Subtotal</td>
       <td>${totalAmount}</td>
     </tr>
     <tr>
       <td></td>
       <td></td>
       <td>Delivery Charge</td>
       <td>${deliveryCharge}</td>
     </tr>
     <tr>
       <td></td>
       <td></td>
       <td style="font-weight: 600;">Total</td>
       <td style="font-weight: 600;">${totalAmount}</td>
     </tr>
   `;

  return { lineItemsHtml, totalAmount };
};

// Function to create an order
export const createOrder = catchAsync(async (req, res, next) => {
  req.body.orderId = uuidv4();
  req.body.user = req.user._id;
  const order = await Order.create(req.body);
  // Add the order to the user's orders array
  await User.findByIdAndUpdate(req.user._id, {
    $push: { orders: order._id },
  });

  // Return the created order
  res.status(201).json({ order });

  // Read the HTML template asynchronously from the templates folder
  const templatePath = path.join(__dirname, "../templates/invoice.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  // Get the line items HTML template
  const { lineItemsHtml, totalAmount } = await makeLineItemsTemplate(order);
  // Replace placeholders in the HTML with dynamic data
  htmlTemplate = htmlTemplate
    .replace("{{orderId}}", order.orderId)
    .replace("{{customerName}}", req.user.name)
    .replace("{{customerId}}", req.user._id)
    .replace("{{customerNo}}", req.user.phone)
    .replace("{{deliveryAddress}}", req.body.address)
    .replace("{{orderedDate}}", new Date().toLocaleDateString())
    .replace("{{totalAmount}}", totalAmount)
    .replace("{{lineItems}}", lineItemsHtml);

  // Send the order confirmation email with HTML content
  await sendEmail({
    from: process.env.SMTP_USER,
    to: req.user.email,
    subject: "Order Confirmation",
    html: htmlTemplate, // Set HTML content here
  });
});

// Function to update an order
export const updateOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  // If cancel order
  if (req.body.isCancelled) {
    req.body.cancellationDate = new Date();
  }

  // Find the order by id and update the details
  const order = await Order.findByIdAndUpdate(orderId, req.body, {
    new: true,
    runValidators: true,
  });

  // Check if the order exists
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Return the updated order
  res.status(200).json({ order });
});

// Function to delete an order
export const deleteOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  // Find the order by id and delete it
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  // Check if the order exists
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Return the deleted order
  res.status(204).json({ order });
});
