const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const createHttpError = require("http-errors");

// ✅ CREATE
const createDish = async (req, res, next) => {
  try {
    const { name, price, category, imageUrl, stock } = req.body; // ✅ imageUrl dari body, bukan file

    if (!name || !price) {
      return next(createHttpError(400, "Name and price are required"));
    }

    const dish = new Dish({
      name,
      price,
      category,
      imageUrl,
      stock: stock || 0,
    });
    await dish.save();

    res.status(201).json({
      success: true,
      message: "Dish Created!",
      data: dish,
    });
  } catch (error) {
    next(error);
  }
};
// ✅ READ ALL
const getAllDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().populate("category", "name");
    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    next(error);
  }
};

// ✅ READ ONE
const getDishById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id);
    if (!dish) return next(createHttpError(404, "Dish Not Found!"));

    res.status(200).json({ success: true, data: dish });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE
const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      { name, price, category, imageUrl, stock },
      { new: true }
    );

    if (!updatedDish) return next(createHttpError(404, "Dish Not Found!"));

    res.status(200).json({
      success: true,
      message: "Dish Updated!",
      data: updatedDish,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE
const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDish = await Dish.findByIdAndDelete(id);
    if (!deletedDish) return next(createHttpError(404, "Dish Not Found!"));

    res
      .status(200)
      .json({ success: true, message: "Dish Deleted Successfully!" });
  } catch (error) {
    next(error);
  }
};

const getPopularDishes = async (req, res, next) => {
  try {
    const popular = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.dishId",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "dishes",
          localField: "_id",
          foreignField: "_id",
          as: "dish",
        },
      },
      {
        $unwind: "$dish",
      },
      {
        $sort: { totalOrders: -1 },
      },
    ]);

    res.status(200).json({ success: true, data: popular });
  } catch (error) {
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
};
