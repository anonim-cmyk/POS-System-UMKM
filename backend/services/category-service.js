const Category = require("../models/categoryModel");
const createHttpError = require("http-errors");

const createCategory = async ({ name, bgColor, icon }) => {
  if (!name) {
    throw createHttpError(400, "Category name is required!");
  }

  const exist = await Category.findOne({ name });
  if (exist) {
    throw createHttpError(400, "Name is already exist");
  }

  const category = await Category.create({ name, bgColor, icon });
  return category;
};

const getAllCategories = async () => {
  return Category.find().sort({ createdAt: -1 });
};

const categoryUpdatedById = async (id, payload) => {
  const allowFields = ["name", "bgColor", "icon"];

  const updateData = {};
  allowFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  });

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw createHttpError(404, "Category is not found!");
  }

  return category;
};

const deleteCategoryById = async (id) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw createHttpError(404, "Category is not found");
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  categoryUpdatedById,
  deleteCategoryById,
};
