const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const shortUUID = require("short-uuid");
const translator = shortUUID();

const addTable = async ({ tableNo, seats }) => {
  if (!tableNo) {
    throw createHttpError(400, "Please provide table number!");
  }

  const exist = await Table.findOne({ tableNo });
  if (exist) {
    throw createHttpError(400, "Table is already exist!");
  }

  const tableId = `table-${translator.new()}`;

  return await Table.create({
    tableId,
    tableNo: Number(tableNo),
    seats: Number(seats),
  });
};

const getTables = async () => {
  return await Table.find().populate({
    path: "currentOrder",
    select: "customer",
  });
};

const updateTable = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid is table id!");
  }

  console.time("updateTable");
  const table = await Table.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  console.timeEnd("updateTable");
  return table;
};

const updateTableStatus = async ({ tableId, status }) => {
  const table = await Table.findOneAndUpdate(
    { tableId },
    { status },
    { new: true }
  );

  if (!table) {
    throw createHttpError(404, "Table is not found!");
  }

  return table;
};

const deleteTable = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid table id!");
  }

  const table = await Table.findByIdAndDelete(id);
  if (!table) {
    throw createHttpError(404, "Table is not found!");
  }

  return true;
};

module.exports = {
  addTable,
  getTables,
  updateTable,
  updateTableStatus,
  deleteTable,
};
