const { default: mongoose } = require("mongoose");
const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const createHttpError = require("http-errors");
const Table = require("../models/tableModel");

const addOrder = async (req, res, next) => {
  console.log("Incoming order:", req.body);
  try {
    const { items, table } = req.body;

    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (!dish) return next(createHttpError(404, "Dish not found"));
      if (dish.stock < item.quantity) {
        return next(createHttpError(400, `Not enough stock for ${dish.name}`));
      }
      dish.stock -= item.quantity;
      await dish.save();
    }

    // 🔹 Buat order
    const order = new Order(req.body);
    await order.save();

    // 🔹 Update status meja jika ada
    if (table) {
      await Table.findByIdAndUpdate(table, { status: "Booked" });
    }

    res
      .status(201)
      .json({ success: true, message: "Order Created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid Id!");
      return next(error);
    }
    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order Not Found!");
      return next(error);
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("table");
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid Id!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    ).populate("table");

    if (!order) {
      const error = createHttpError(404, "Order Not Found!");
      return next(error);
    }
    if (orderStatus === "Completed" && order.table?._id) {
      await Table.findByIdAndUpdate(order.table._id, { status: "Available" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order Updated!", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };
