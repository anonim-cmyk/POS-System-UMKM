const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");

const connectDB = require("./config/database");

const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://post-frontend-five.vercel.app"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello From POS Server!",
  });
});

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/sales", require("./routes/reportRoute"));
app.use("/api/invoices", require("./routes/invoiceRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/dishes", require("./routes/dishRoute"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));

app.use((req, res, next) => {
  next(
    createHttpError.NotFound(
      `Route ${req.method} ${req.originalUrl} tidak ditemukan`
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
