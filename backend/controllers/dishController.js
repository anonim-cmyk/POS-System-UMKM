const dishService = require("../services/dish-service");
const Dish = require("../models/dishModel");

const createDish = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    const dish = await dishService.createDish({
      ...req.body,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Dish Created!",
      data: dish,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDishes = async (req, res, next) => {
  try {
    const dishes = await dishService.getAllDishes(req.query);
    res.status(200).json({ success: true, ...dishes });
  } catch (error) {
    next(error);
  }
};

const getDishById = async (req, res, next) => {
  try {
    const dish = await dishService.getDishById(req.params.id);
    res.status(200).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

const updateDish = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    const dish = await dishService.updateDish(req.params.id, {
      ...req.body,
      imageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Dish Updated!",
      data: dish,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    await dishService.deleteDish(req.params.id);
    res.status(200).json({
      success: true,
      message: "Dish Deleted Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const getPopularDishes = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const dishes = await dishService.getPopularDishes(limit);
    console.log("dishes: ", dishes);

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error) {
    next(error);
  }
};

const getLowStockDishes = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const dishes = await Dish.find({
      stock: { $lte: threshold },
    }).select("name stock");

    res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (error) {
    console.error("LOW STOCK ERROR:", error);
    next(error);
  }
};

module.exports = {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
  getPopularDishes,
  getLowStockDishes,
};
