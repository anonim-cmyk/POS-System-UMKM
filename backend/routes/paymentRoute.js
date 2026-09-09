const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  createOrder,
  verifyPayment,
  webHookVerification,
  getAllPayment,
  createCashPayment,
} = require("../controllers/paymentController");

// router.post("/cash", createCashPayment);
router.route("/create-order").post(isVerifiedUser, createOrder);
router.route("/verify-payment").post(isVerifiedUser, verifyPayment);
router.post("/webhook", webHookVerification);

// router.get("/filtered", getFilteredPayments);
router.get("/", getAllPayment);
module.exports = router;
