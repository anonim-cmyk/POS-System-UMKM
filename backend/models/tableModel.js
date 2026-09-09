const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableId: {
    type: String,
    unique: true,
  },
  tableNo: { type: Number, require: true, unique: true },
  status: {
    type: String,
    default: "Available",
  },
  seats: {
    type: Number,
    require: true,
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = mongoose.model("Table", tableSchema);
