const express = require("express");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { getSalesReport } = require("../controllers/reportController");

const router = express.Router();

// routes/report.route.js
router.route("/").get(isVerifiedUser, getSalesReport);

module.exports = router;
