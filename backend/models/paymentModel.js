const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  amount: Number,
  currency: String,
  status: String,
  method: String,
  customerName: { type: String, default: "Guest" }, // ✅ Tambahkan ini
  customerPhone: { type: String, default: "-" }, // ✅ Tambahkan ini
  tableNo: { type: Number },
  tableId: { type: String },
  email: String,
  contact: String,
  createdAt: Date,
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
