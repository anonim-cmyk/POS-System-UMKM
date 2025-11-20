const express = require("express");
const { getDashboardMetrics } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/metrics", getDashboardMetrics);

module.exports = router;
