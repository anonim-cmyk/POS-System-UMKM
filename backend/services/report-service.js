// services/report.service.js
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");

const getDateRange = (range = "") => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  let from = null;

  switch (range) {
    case "week":
      from = new Date(now);
      from.setDate(now.getDate() - 7);
      break;

    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case "year":
      from = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      return {}; // ⬅️ All Time
  }

  return { from, to: now };
};

const getSalesReport = async (range) => {
  let { from, to } = getDateRange(range);

  // untuk All Time
  const matchFilter = from && to ? { createdAt: { $gte: from, $lte: to } } : {};

  const [
    revenueSummaryResult,
    totalOrders,
    completedOrders,
    revenueByMethod,
    topItems,
    revenueTrend,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { orderStatus: "completed", ...matchFilter } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$bills.total" },
          taxTotal: { $sum: "$bills.tax" },
          grossRevenue: { $sum: "$bills.totalWithTax" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
    Order.countDocuments(matchFilter),
    Order.countDocuments({ orderStatus: "completed", ...matchFilter }),
    Payment.aggregate([
      { $match: { status: "success", ...matchFilter } },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      { $match: { orderStatus: "completed", ...matchFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          qty: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { qty: -1, revenue: -1, _id: -1 } },
      { $limit: 5 },
    ]),
    Payment.aggregate([
      { $match: { status: "success", ...matchFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const revenueSummary = revenueSummaryResult[0];
  const totalRevenue = revenueSummary?.totalRevenue || 0;

  const completionRate =
    totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const avgOrderValue =
    completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

  return {
    period: {
      type: range || "all",
      label:
        range === "week"
          ? "This Week"
          : range === "month"
          ? "This Month"
          : range === "year"
          ? "This Year"
          : "All Time",
    },
    range: {
      start: from,
      end: to,
      timezone: "Asia/Jakarta",
      daysCount:
        from && to ? Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1 : null,
    },
    summary: {
      netRevenue: revenueSummary?.totalRevenue || 0,
      taxTotal: revenueSummary?.taxTotal || 0,
      grossRevenue: revenueSummary?.grossRevenue || 0,
      totalOrders,
      completedOrders,
      completionRate,
      avgOrderValue,
    },
    revenueByMethod,
    topItems,
    revenueTrend,
  };
};

module.exports = {
  getSalesReport,
};
