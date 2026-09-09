const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router
  .route("/")
  .post(isVerifiedUser, addCategory)
  .get(isVerifiedUser, getCategories);

router
  .route("/:id")
  .patch(isVerifiedUser, updateCategory)
  .delete(isVerifiedUser, deleteCategory);

module.exports = router;
