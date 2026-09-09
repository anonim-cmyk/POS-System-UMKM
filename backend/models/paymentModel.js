const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentCode: { type: String, required: true, unique: true, index: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "IDR" },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String, enum: ["cash", "online"], required: true },

    // Midtrans specific
    snapToken: { type: String },
    midtransResponse: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
