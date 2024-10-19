import catchAsync from "../utils/catchAsync.js";
import Order from "../models/order.js";
import BulkOrder from "../models/bulkOrder.js";

function getDateRange(year, month, day = null) {
  let startDate, endDate;

  if (day) {
    startDate = new Date(year, month - 1, day, 0, 0, 0);
    endDate = new Date(year, month - 1, day, 23, 59, 59);
  } else {
    startDate = new Date(year, month - 1, 1); // month is 0-indexed in JavaScript Date objects
    endDate = new Date(year, month, 0, 23, 59, 59); // Get last day of the month
  }

  return { startDate, endDate };
}

async function getOrdersCount(year, month, day = null) {
  let { startDate, endDate } = getDateRange(year, month, day);

  const count = await Order.countDocuments({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return count;
}

async function getCancelledOrdersCount(year, month, day = null) {
  let { startDate, endDate } = getDateRange(year, month, day);
  const count = await Order.countDocuments({
    isCancelled: true,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return count;
}

async function getOrdersRevenue(year, month, day = null) {
  let { startDate, endDate } = getDateRange(year, month, day);

  const filter = {
    paymentStatus: "paid",
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (day) {
    filter.date.$gte = startDate;
    filter.date.$lte = endDate;
  }

  const orders = await Order.find(filter);

  const revenue = orders.reduce(
    (total, order) => total + (order.paymentAmount || 0),
    0
  );

  return revenue;
}

async function getBulkOrdersCount(year, month, day = null) {
  let { startDate, endDate } = getDateRange(year, month, day);
  const count = await BulkOrder.countDocuments({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  return count;
}

// Function to get report
const getReport = catchAsync(async (req, res, next) => {
  const { year, month, day } = req.query;

  let ordersCount, cancelledOrdersCount, revenue, bulkOrdersCount;

  if (day) {
    // Fetching for a specific day
    ordersCount = await getOrdersCount(year, month, day);
    cancelledOrdersCount = await getCancelledOrdersCount(year, month, day);
    revenue = await getOrdersRevenue(year, month, day);
    bulkOrdersCount = await getBulkOrdersCount(year, month, day);
  } else {
    // Fetching for the whole month
    ordersCount = await getOrdersCount(year, month);
    cancelledOrdersCount = await getCancelledOrdersCount(year, month);
    revenue = await getOrdersRevenue(year, month);
    bulkOrdersCount = await getBulkOrdersCount(year, month);
  }

  const report = {
    ordersCount,
    cancelledOrdersCount,
    revenue,
    bulkOrdersCount,
  };

  // Return the report
  res.status(200).json({ report });
});

export default getReport;
