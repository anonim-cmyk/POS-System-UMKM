const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");

const getDateRanges = (filter) => {
  const now = new Date();
  let start, end, prevStart, prevEnd;

  switch (filter) {
    case "7d":
      end = now;
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      prevEnd = new Date(start);
      prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 7);
      break;
    case "30d":
      end = now;
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      prevEnd = new Date(start);
      prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 30);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
      prevEnd = new Date(start);
      prevStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
      prevEnd = new Date(start);
      prevStart = new Date(start.getFullYear() - 1, 0, 1);
      break;
    default:
      // default 30 days
      end = now;
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      prevEnd = new Date(start);
      prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 30);
      break;
  }

  return { start, end, prevStart, prevEnd };
};

const calcGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const getDashboardMetrics = async (req, res, next) => {
  try {
    const filter = req.query.range || "30d";
    const { start, end, prevStart, prevEnd } = getDateRanges(filter);

    // 🔹 Jalankan query paralel
    const [
      revenueCurrentAgg,
      revenuePrevAgg,
      ordersCurrent,
      completedOrdersCurrent,
      inProgressOrdersCurrent,
      ordersPrev,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            orderStatus: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$bills.total" }, // ✅ NET revenue
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            orderStatus: "completed",
            createdAt: { $gte: prevStart, $lt: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$bills.total" },
          },
        },
      ]),
      Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Order.countDocuments({
        orderStatus: "completed",
        createdAt: { $gte: start, $lte: end },
      }),
      Order.countDocuments({
        orderStatus: { $ne: "completed" },
        createdAt: { $gte: start, $lte: end },
      }),
      Order.countDocuments({ createdAt: { $gte: prevStart, $lt: prevEnd } }),
    ]);

    const totalRevenue = revenueCurrentAgg[0]?.total || 0;
    const lastPeriodRevenue = revenuePrevAgg[0]?.total || 0;
    const revenueGrowth = calcGrowth(totalRevenue, lastPeriodRevenue);

    const totalOrders = ordersCurrent;
    const completedOrders = completedOrdersCurrent;
    const inProgressOrders = inProgressOrdersCurrent;
    const orderGrowth = calcGrowth(totalOrders, ordersPrev);

    // 🔹 Items summary
    const [totalCategories, totalDishes, activeTables, totalTables] =
      await Promise.all([
        Category.countDocuments(),
        Dish.countDocuments(),
        Table.countDocuments({ status: "Booked" }),
        Table.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          lastPeriodRevenue,
          revenueGrowth,
          totalOrders,
          completedOrders,
          inProgressOrders,
          orderGrowth,
        },
        items: {
          totalCategories,
          totalDishes,
          activeTables,
          totalTables,
        },
      },
    });
  } catch (error) {
    console.error("❌ Dashboard Metrics Error:", error);
    next(error);
  }
};

module.exports = { getDashboardMetrics };
