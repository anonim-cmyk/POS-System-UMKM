const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      guests: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    orderStatus: {
      type: String,
      enum: ["in_progress", "ready", "completed"],
      default: "in_progress",
      index: true,
    },
    bills: {
      total: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true, min: 0 },
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order items cannot be empty"],
    },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
