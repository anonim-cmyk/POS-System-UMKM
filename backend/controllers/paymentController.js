const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const Table = require("../models/tableModel");

// 🔹 Inisialisasi MIDTRANS Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// ===========================================================
// 🟡 CREATE ORDER
// ===========================================================
const createOrder = async (req, res, next) => {
  try {
    const {
      order_id,
      gross_amount,
      customer_name = "Guest",
      customer_phone = "-",
      tableNo,
      tableId,
      method,
    } = req.body;

    // 💵 Cash payment
    if (method?.toLowerCase() === "cash") {
      await Payment.create({
        orderId: order_id,
        amount: gross_amount,
        currency: "IDR",
        status: "success",
        method: "cash",
        customerName: customer_name,
        customerPhone: customer_phone,
        tableNo,
        tableId,
        createdAt: new Date(),
      });
      return res
        .status(200)
        .json({ success: true, message: "Cash payment recorded" });
    }

    // Validasi Online Payment
    if (!gross_amount || gross_amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gross amount." });
    }

    const orderId = order_id || `ORDER-${Date.now()}`;
    const roundedAmount = Math.round(gross_amount);

    // Buat transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: roundedAmount,
      },
      customer_details: {
        first_name: customer_name,
        phone: customer_phone,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan payment Online ke DB
    await Payment.create({
      paymentId: transaction.token,
      orderId,
      amount: roundedAmount,
      currency: "IDR",
      status: "pending",
      method: "midtrans",
      customerName: customer_name,
      customerPhone: customer_phone,
      tableNo,
      tableId,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      token: transaction.token,
      orderId,
    });
  } catch (error) {
    console.error("❌ Midtrans Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Midtrans order",
      error: error.message,
    });
  }
};

// ===========================================================
// 🟢 VERIFY PAYMENT (Manual Check)
// ===========================================================
const verifyPayment = async (req, res, next) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing order_id" });
    }

    const statusResponse = await core.transaction.status(order_id);
    console.log("✅ Midtrans Status Response:", statusResponse);

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    // 🔹 Mapping status Midtrans → status aplikasi kamu
    let newStatus = "pending";
    if (transactionStatus === "capture" && fraudStatus === "accept") {
      newStatus = "success";
    } else if (transactionStatus === "settlement") {
      newStatus = "success";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "failed";
    }

    // 🔹 Update status di DB pakai newStatus
    await Payment.findOneAndUpdate(
      { orderId: order_id },
      { status: newStatus },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: { ...statusResponse, appStatus: newStatus },
    });
  } catch (error) {
    console.error("❌ Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// ===========================================================
// 🔔 WEBHOOK — otomatis dari Midtrans
// ===========================================================
const webHookVerification = async (req, res, next) => {
  console.log("📥 Webhook body:", req.body);
  try {
    const notificationJson = req.body;
    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const statusResponse = await core.transaction.notification(
      notificationJson
    );

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `📩 Notification received | Order ID: ${orderId} | Status: ${transactionStatus} | Fraud: ${fraudStatus}`
    );

    let newStatus = "pending";
    if (transactionStatus === "capture" && fraudStatus === "accept") {
      newStatus = "success";
    } else if (transactionStatus === "settlement") {
      newStatus = "success";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "failed";
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      { status: newStatus },
      { new: true }
    );

    console.log("📦 Found Payment:", updatedPayment);

    if (!updatedPayment) {
      console.warn(`⚠️ Payment not found for order ${orderId}`);
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    // 🧩 Update table jika pembayaran berhasil
    if (newStatus === "success" && updatedPayment?.tableNo) {
      await Table.findOneAndUpdate(
        { tableNo: updatedPayment.tableNo },
        { status: "Booked" }
      );
      console.log(`✅ Table ${updatedPayment.tableNo} updated to 'Booked'`);
    }

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    next(error);
  }
};

const getAllPayment = async (req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    console.error("❌ Get Payments Error: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

// 📁 controllers/paymentController.js
const getFilteredPayments = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, period } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    // 🟢 Filter by status
    if (status) {
      const normalized = status.toLowerCase();
      if (["success", "pending", "failed"].includes(normalized)) {
        filter.status = { $regex: new RegExp(`^${normalized}$`, "i") };
      }
    }

    // 🗓️ Filter by period (week, month, year)
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filter.createdAt = { $gte: weekAgo, $lte: now };
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filter.createdAt = { $gte: monthAgo, $lte: now };
    } else if (period === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      filter.createdAt = { $gte: yearAgo, $lte: now };
    }

    // 📊 Hitung total item dan total halaman
    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // 💰 Hitung total amount keseluruhan (bisa per filter juga)
    const totalAmountAgg = await Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      totalAmount, // ⬅️ kirim totalAmount ke frontend
      data: payments,
    });
  } catch (error) {
    console.error("❌ getFilteredPayments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered payments",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  webHookVerification,
  getAllPayment,
  getFilteredPayments,
};
