const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");

const getDashboardMetrics = async (req, res, next) => {
  try {
    // ✅ Tambahkan filter range dari frontend
    const filter = req.query.range || "30d";
    let dateFrom = new Date();

    if (filter === "7d") {
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (filter === "30d") {
      dateFrom.setDate(dateFrom.getDate() - 30);
    } else if (filter === "month") {
      dateFrom = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
    } else if (filter === "year") {
      dateFrom = new Date(dateFrom.getFullYear(), 0, 1);
    }

    console.log("📌 Range Filter Active:", filter, "| From:", dateFrom);

    // ----------------------------------------
    // ✅ Kode asli kamu tetap ada di bawah ini
    // ----------------------------------------

    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const firstDayThisMonthCopy = new Date(firstDayThisMonth);

    console.log("📅 Time windows:");
    console.log("  First Day This Month:", firstDayThisMonth);
    console.log("  First Day Last Month:", firstDayLastMonth);

    // ✅ Revenue this month (TETAP — tapi nanti kita override display berdasarkan filter)
    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          orderStatus: "Completed",
          createdAt: { $gte: firstDayThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$bills.totalWithTax" } } },
    ]);

    // ✅ Revenue last month
    const revenueLastMonth = await Order.aggregate([
      {
        $match: {
          orderStatus: "Completed",
          createdAt: { $gte: firstDayLastMonth, $lt: firstDayThisMonthCopy },
        },
      },
      { $group: { _id: null, total: { $sum: "$bills.totalWithTax" } } },
    ]);

    const totalRevenue = revenueThisMonth[0]?.total || 0;
    const lastMonthRevenue = revenueLastMonth[0]?.total || 0;

    console.log("💰 Revenue Logs:");
    console.log("  revenueThisMonth:", revenueThisMonth);
    console.log("  revenueLastMonth:", revenueLastMonth);
    console.log("  totalRevenue:", totalRevenue);
    console.log("  lastMonthRevenue:", lastMonthRevenue);

    const revenueGrowth = lastMonthRevenue
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 100;

    // ✅ Orders
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({
      orderStatus: "Completed",
    });
    const inProgressOrders = await Order.countDocuments({
      orderStatus: { $ne: "Completed" },
    });

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: firstDayLastMonth, $lt: firstDayThisMonthCopy },
    });

    const orderGrowth = lastMonthOrders
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 100;

    console.log("📦 Order Logs:");
    console.log("  totalOrders:", totalOrders);
    console.log("  completedOrders:", completedOrders);
    console.log("  inProgressOrders:", inProgressOrders);
    console.log("  lastMonthOrders:", lastMonthOrders);
    console.log("  orderGrowth:", orderGrowth);

    // ✅ Items and tables
    const totalCategories = await Category.countDocuments();
    const totalDishes = await Dish.countDocuments();
    const activeTables = await Table.countDocuments({ status: "Booked" });
    const totalTables = await Table.countDocuments();

    console.log("🍽️ Inventory Logs:");
    console.log("  totalCategories:", totalCategories);
    console.log("  totalDishes:", totalDishes);
    console.log("  activeTables:", activeTables);
    console.log("  totalTables:", totalTables);

    const categoryGrowth = 100;
    const dishesGrowth = 100;
    const activeTableGrowth = activeTables > 0 ? 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          lastMonthRevenue,
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
          categoryGrowth,
          dishesGrowth,
          activeTableGrowth,
        },
      },
    });
  } catch (error) {
    console.error("❌ Dashboard Metrics Error:", error);
    next(error);
  }
};

module.exports = { getDashboardMetrics };
