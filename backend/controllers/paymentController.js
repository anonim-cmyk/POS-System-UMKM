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
    const { order_id, gross_amount, customer_name, email, tableNo, tableId } =
      req.body;

    if (!gross_amount || gross_amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gross amount." });
    }

    const orderId = order_id || `ORDER-${Date.now()}`;
    const roundedAmount = Math.round(gross_amount);

    // 🔹 Data transaksi
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: roundedAmount,
      },
      customer_details: {
        first_name: customer_name || "Guest",
        email: email || "guest@example.com",
      },
      credit_card: {
        secure: true,
      },
    };

    // 🔹 Request ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // 🔹 Simpan data pembayaran ke DB
    await Payment.create({
      paymentId: transaction.token,
      orderId,
      amount: roundedAmount,
      currency: "IDR",
      status: "pending",
      method: "midtrans",
      email: email || "guest@example.com",
      tableNo,
      tableId,
      createdAt: new Date(),
    });

    // 🔹 Kirim response ke frontend
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

    // 🔹 Update status di DB
    await Payment.findOneAndUpdate(
      { orderId: order_id },
      { status: statusResponse.transaction_status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: statusResponse,
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

module.exports = { createOrder, verifyPayment, webHookVerification };
