const express = require("express");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  getOrderByCode,
} = require("../controllers/orderController");
const router = express.Router();

router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
// router.route("/code/:orderCode").get(getOrderByCode);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").patch(isVerifiedUser, updateOrder);

module.exports = router;
