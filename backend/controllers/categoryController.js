const categoryService = require("../services/category-service");

const addCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category Added!",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.categoryUpdatedById(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Category Updated!",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category Deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
