const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const createHttpError = require("http-errors");

// create
const createDish = async (payload) => {
  const { name, price } = payload;

  if (!name || !price) {
    throw createHttpError(400, "Name and price are required");
  }

  return await Dish.create({
    name: payload.name,
    price: payload.price,
    category: payload.category,
    imageUrl: payload.imageUrl,
    stock: payload.stock ?? 0,
  });
};

// read
const getAllDishes = async ({ page = 1, limit = 10, search } = {}) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const skip = (Number(page) - 1) * Number(limit);

  const [dishes, total] = await Promise.all([
    Dish.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Dish.countDocuments(query),
  ]);

  return {
    data: dishes,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDishById = async (id) => {
  const dish = await Dish.findById(id);
  if (!dish) throw createHttpError(404, "Dish Not Found");
  return dish;
};

// update
const updateDish = async (id, payload) => {
  const dish = await Dish.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!dish) throw createHttpError(404, "Dish Not Found");
  return dish;
};

// delete
const deleteDish = async (id) => {
  const dish = await Dish.findByIdAndDelete(id);
  if (!dish) throw createHttpError(404, "Dish Not Found");
  return dish;
};

// popular
const getPopularDishes = async (limit = 10) => {
  return await Order.aggregate([
    // hanya order selesai
    {
      $match: {
        orderStatus: "completed",
      },
    },

    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.menuId", // ✅ SESUAI MODEL
        totalQty: { $sum: "$items.qty" }, // ✅ SESUAI MODEL
        totalRevenue: {
          $sum: { $multiply: ["$items.price", "$items.qty"] },
        },
      },
    },

    { $sort: { totalQty: -1 } },

    { $limit: limit },

    {
      $lookup: {
        from: "dishes", // ⛔ PENTING: ini harus sesuai collection name
        localField: "_id",
        foreignField: "_id",
        as: "dish",
      },
    },

    { $unwind: "$dish" },

    {
      $project: {
        _id: "$dish._id",
        name: "$dish.name",
        imageUrl: "$dish.imageUrl",
        totalQty: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

module.exports = {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
  getPopularDishes,
};
