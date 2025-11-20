const createHttpError = require("http-errors");
const Table = require("../models/tableModel");
const mongoose = require("mongoose");

const addTable = async (req, res, next) => {
  try {
    const { tableNo, seats } = req.body;

    if (!tableNo) {
      const error = createHttpError(400, "Please provide table number!");
      return next(error);
    }

    const isTablePresent = await Table.findOne({ tableNo });
    if (isTablePresent) {
      const error = createHttpError(400, "Table Already Exist!");
      return next(error);
    }
    const newTable = new Table({
      tableNo: Number(tableNo),
      seats: Number(seats),
    });
    await newTable.save();
    res
      .status(201)
      .json({ success: true, message: "Table Added!", data: newTable });
  } catch (error) {
    next(error);
  }
};
const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate({
      path: "currentOrder",
      select: "customerDetails",
    });
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};
const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNo, seats, status, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid Id!"));
    }

    const table = await Table.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(tableNo !== undefined && { tableNo }),
          ...(seats !== undefined && { seats }),
          ...(status !== undefined && { status }),
          ...(orderId !== undefined && { currentOrder: orderId }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!table) {
      return next(createHttpError(404, "Table Not Found!"));
    }

    res.status(200).json({
      success: true,
      message: "Table Updated!",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

const updateTableStatus = async (req, res, next) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const { tableId, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      const error = createHttpError(404, "Invalid Table Id!");
      return next(error);
    }

    const table = await Table.findByIdAndUpdate(
      tableId,
      { status },
      { new: true }
    );

    if (!table) {
      const error = createHttpError(404, "Table Not Found!");
      return next(error);
    }
    res
      .status(200)
      .json({ success: true, message: "Table Status Updated!", data: table });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid Table Id!");
      return next(error);
    }

    const deleted = await Table.findByIdAndDelete(id);

    if (!deleted) {
      const error = createHttpError(404, "Table Not Found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Table Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTable,
  getTables,
  updateTable,
  updateTableStatus,
  deleteTable,
};
