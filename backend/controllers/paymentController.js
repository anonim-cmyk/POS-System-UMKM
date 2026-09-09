const paymentService = require("../services/payment-service");
const Order = require("../models/orderModel");
// 🟡 CREATE
const createOrder = async (req, res, next) => {
  try {
    const { orderCode, paymentMethod } = req.body;

    // Resolve orderCode ke _id
    const order = await Order.findOne({ orderCode });
    if (!order) throw createHttpError(404, "Order not found");

    const payment = await paymentService.createPayment({
      orderId: order._id,
      paymentMethod,
    });
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// const createCashPayment = async (req, res, next) => {
//   try {
//     const {
//       orderCode,
//       grossAmount,
//       customerName,
//       customerPhone,
//       tableId,
//       tableNo,
//     } = req.body;

//     const exists = await Payment.findOne({ orderCode });
//     if (exists) {
//       return res.status(400).json({ message: "Payment already exists" });
//     }

//     const payment = await Payment.create({
//       orderCode,
//       grossAmount,
//       paymentMethod: "cash",
//       status: "success",
//       customerName,
//       customerPhone,
//       tableId,
//       tableNo,
//     });

//     res.status(201).json({
//       success: true,
//       data: payment,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// 🟢 VERIFY
const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(req.body.order_id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// 🔔 WEBHOOK
const webHookVerification = async (req, res, next) => {
  try {
    await paymentService.handleWebhook(req.body);
    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (err) {
    next(err);
  }
};

// 🟣 GET ALL
const getAllPayment = async (req, res, next) => {
  try {
    const result = await paymentService.getPayments(req.query);

    res.json({
      success: true,
      data: result.payments,
      totalPages: result.totalPages,
      totalAmount: result.totalAmount,
      currentPage: result.currentPage,
      totalRecords: result.totalRecords,
    });
  } catch (err) {
    next(err);
  }
};

// 🔵 GET FILTERED
// const getFilteredPayments = async (req, res, next) => {
//   try {
//     const payments = await paymentService.getFilteredPayments(req.query);
//     res.json({
//       success: true,
//       count: payments.length,
//       data: payments,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = {
  createOrder,
  verifyPayment,
  webHookVerification,
  getAllPayment,
  // createCashPayment,
  // getFilteredPayments,
};
