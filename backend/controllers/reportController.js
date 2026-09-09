const reportService = require("../services/report-service");

const getSalesReport = async (req, res, next) => {
  try {
    const { period } = req.query;
    console.log("period: ", period);

    const report = await reportService.getSalesReport(period);
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSalesReport };
