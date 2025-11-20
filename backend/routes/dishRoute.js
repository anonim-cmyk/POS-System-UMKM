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
} = require("../controllers/dishController");

// 🔧 Konfigurasi storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "dishes",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"], // ✅ SVG boleh juga
  },
});

const upload = multer({ storage });

// ✅ CREATE (pakai upload)
router.post("/", upload.single("image"), createDish);

// ✅ READ ALL
router.get("/", getAllDishes);

// ✅ READ ONE
router.get("/:id", getDishById);

// ✅ UPDATE (kalau mau bisa update gambar juga)
router.put("/:id", updateDish);

// ✅ DELETE
router.delete("/:id", deleteDish);

router.get("/popula/list", getPopularDishes);

module.exports = router;
