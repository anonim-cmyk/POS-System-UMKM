const tableService = require("../services/table-service");

const addTable = async (req, res, next) => {
  try {
    const table = await tableService.addTable(req.body);
    res.status(201).json({
      success: true,
      message: "Table Added!",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

const getTables = async (req, res, next) => {
  try {
    const tables = await tableService.getTables();
    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  console.log("UPDATE TABLE HIT:", req.params.id);
  try {
    const table = await tableService.updateTable(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Table updated!",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

const updateTableStatus = async (req, res, next) => {
  console.log("UPDATE TABLE STATUS HIT:", req.body);
  try {
    const table = await tableService.updateTableStatus(req.body);

    res.status(200).json({
      success: true,
      message: "Table status updated!",
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    await tableService.deleteTable(req.params.id);

    res.status(200).json({
      success: true,
      message: "Table Deleted Successfully!",
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
