const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const createHttpError = require("http-errors");

const getInvoiceByOrderCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;

    const order = await Order.findOne({ orderCode }).lean();
    if (!order) throw createHttpError(404, "Order not found");

    const payment = await Payment.findOne({ order: order._id }).lean();
    if (!payment || payment.status !== "success") {
      throw createHttpError(400, "Payment not completed");
    }

    res.json({
      success: true,
      data: {
        orderCode: order.orderCode,
        orderDate: order.createdAt,
        customer: order.customer,
        items: order.items,
        bills: order.bills,
        payment: {
          method: payment.paymentMethod,
          status: payment.status,
          paymentCode: payment.paymentCode,
          paidAt: payment.updatedAt,
          midtrans:
            payment.paymentMethod === "online"
              ? payment.midtransResponse
              : null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvoiceByOrderCode };
