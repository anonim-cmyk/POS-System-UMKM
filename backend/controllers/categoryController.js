const Category = require("../models/categoryModel");
const createHttpError = require("http-errors");

// ✅ Tambah kategori
const addCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res
      .status(201)
      .json({ success: true, message: "Category added!", data: category });
  } catch (error) {
    next(error);
  }
};

// ✅ Ambil semua kategori
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// ✅ Update kategori
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) return next(createHttpError(404, "Category not found!"));

    res
      .status(200)
      .json({ success: true, message: "Category updated!", data: category });
  } catch (error) {
    next(error);
  }
};

// ✅ Hapus kategori
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(createHttpError(404, "Category not found!"));

    res.status(200).json({ success: true, message: "Category deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
