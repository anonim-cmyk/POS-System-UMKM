const midtransClient = require("midtrans-client");
const Payment = require("../models/paymentModel");
const Table = require("../models/tableModel");
const Order = require("../models/orderModel");
const createHttpError = require("http-errors");
const crypto = require("crypto");

// 🔹 Midtrans init
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// ===============================
// 🟡 CREATE PAYMENT
// ===============================
const createPayment = async ({ orderId, paymentMethod }) => {
  const order = await Order.findById(orderId);
  if (!order) throw createHttpError(404, "Order not found");
  console.log("CREATE PAYMENT:", orderId, paymentMethod);
  console.log("order: ", order);

  const existingPayment = await Payment.findOne({ order: order._id });
  if (existingPayment) return existingPayment;

  const paymentCode = `PAY-${crypto.randomUUID()}`;

  const payment = await Payment.create({
    paymentCode,
    order: order._id,
    orderCode: order.orderCode,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    amount: order.bills.totalWithTax,
    paymentMethod,
    status: paymentMethod === "cash" ? "success" : "pending",
  });

  await Order.findByIdAndUpdate(order._id, {
    payment: payment._id,
  });

  if (paymentMethod === "online") {
    const trx = await snap.createTransaction({
      transaction_details: {
        order_id: payment.paymentCode,
        gross_amount: payment.amount,
      },
      customer_details: {
        first_name: order.customer.name,
        phone: order.customer.phone,
      },
    });

    payment.snapToken = trx.token;
    payment.midtransResponse = trx;

    await payment.save();
  }

  return payment;
};

// ===============================
// 🟢 VERIFY PAYMENT
// ===============================
const verifyPayment = async (paymentCode) => {
  const statusResponse = await core.transaction.status(paymentCode);

  let newStatus = "pending";
  if (
    statusResponse.transaction_status === "capture" ||
    statusResponse.transaction_status === "settlement"
  ) {
    newStatus = "success";
  } else if (
    ["cancel", "deny", "expire"].includes(statusResponse.transaction_status)
  ) {
    newStatus = "failed";
  }

  const payment = await Payment.findOneAndUpdate(
    { paymentCode },
    { status: newStatus },
    { new: true }
  );

  if (!payment) throw createHttpError(404, "Payment not found");

  return payment;
};

// ===============================
// 🔔 WEBHOOK
// ===============================
const handleWebhook = async (notification) => {
  const statusResponse = await core.transaction.notification(notification);

  let newStatus = "pending";
  if (
    statusResponse.transaction_status === "capture" ||
    statusResponse.transaction_status === "settlement"
  ) {
    newStatus = "success";
  } else if (
    ["cancel", "deny", "expire"].includes(statusResponse.transaction_status)
  ) {
    newStatus = "failed";
  }

  const payment = await Payment.findOneAndUpdate(
    { paymentCode: statusResponse.order_id },
    { status: newStatus },
    { new: true }
  ).populate("order");

  if (!payment) throw createHttpError(404, "Payment not found");

  if (newStatus === "success" && payment.order) {
    if (payment.order.table) {
      await Table.findByIdAndUpdate(payment.order.table._id, {
        status:
          payment.order.orderStatus === "completed" ? "Available" : "Booked",
        currentOrder:
          payment.order.orderStatus === "completed" ? null : payment.order._id,
      });
    }
  }

  if (payment.status === newStatus) {
    return payment;
  }
};

const getPayments = async (queryParams = {}) => {
  const { page = 1, limit = 10, status, period, search } = queryParams;
  const filter = {};

  if (search) {
    filter.$or = [
      {
        orderCode: { $regex: search, $options: "i" },
      },
      {
        customerName: { $regex: search, $options: "i" },
      },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (period) {
    const now = new Date();
    let startDate = null;

    if (period === "week") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    if (period === "month") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    if (period === "year") {
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
    }

    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }
  }

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  const [payments, totalRecords, totalAmountResult] = await Promise.all([
    Payment.find(filter)
      .populate({
        path: "order",
        select: "orderCode customer table orderStatus",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),

    Payment.countDocuments(filter),

    Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const totalAmount = totalAmountResult[0]?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    payments,
    totalPages,
    totalAmount,
    currentPage: pageNumber,
    totalRecords,
  };
};

module.exports = {
  createPayment,
  verifyPayment,
  handleWebhook,
  getPayments,
};
