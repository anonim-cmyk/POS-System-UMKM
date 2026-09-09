const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");
const {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
  getPopularDishes,
  getLowStockDishes,
} = require("../controllers/dishController");

// 🔧 Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "dishes",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
});

const upload = multer({ storage });

// ✅ CREATE
router.post("/", upload.single("image"), createDish);

// ✅ STATIC ROUTES — HARUS DI ATAS
router.get("/low-stock", getLowStockDishes);
router.get("/popular/list", getPopularDishes);

// ✅ READ ALL
router.get("/", getAllDishes);

// ✅ READ ONE (PALING BAWAH)
router.get("/:id", getDishById);

// ✅ UPDATE
router.put("/:id", updateDish);

// ✅ DELETE
router.delete("/:id", deleteDish);

module.exports = router;
