const orderService = require("../services/order-service");
const Order = require("../models/orderModel");

// CREATE
const addOrder = async (req, res, next) => {
  console.log("REQ USER:", req.user);
  console.log("REQ Body:", req.body);
  try {
    const order = await orderService.addOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Order Created!",
      data: order,
    });

    console.log("order: ", order);
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getOrders = async (req, res, next) => {
  console.log("request: ", req.query);

  try {
    const orders = await orderService.getOrders(req.query);
    res.status(200).json({ success: true, ...orders });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "orderStatus is required",
      });
    }
    const order = await orderService.updateOrder(req.params.id, orderStatus);
    res
      .status(200)
      .json({ success: true, message: "Order Updated!", data: order });
  } catch (error) {
    console.error("error update: ", error);

    next(error);
  }
};

// const getOrderByCode = async (req, res) => {
//   try {
//     const { orderCode } = req.params;
//     if (!orderCode)
//       return res.status(400).json({ message: "Order code is required" });

//     const order = await Order.findOne({ orderCode }).lean();

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Pastikan semua field ada untuk Invoice
//     res.status(200).json({
//       ...order,
//       customerDetails: order.customerDetails || {
//         name: order.customerName,
//         phone: order.customerPhone,
//         guests: order.guests,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = {
  addOrder,
  getOrderById,
  getOrders,
  updateOrder,
  // getOrderByCode,
};
