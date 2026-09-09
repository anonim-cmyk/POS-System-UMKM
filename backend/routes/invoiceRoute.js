const { getInvoiceByOrderCode } = require("../controllers/invoiceController");

const router = require("express").Router();

router.get("/order-code/:orderCode", getInvoiceByOrderCode);

module.exports = router;
