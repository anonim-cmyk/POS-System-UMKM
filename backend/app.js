require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const createHttpError = require("http-errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const PORT = config.port;
connectDB();
// Middlewares
// Parse incoming request in json format
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://pos-frontend-jet.vercel.app"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello From POS Server!" });
});

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/sales", require("./routes/reportRoute"));
app.use("/api/invoices", require("./routes/invoiceRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/dishes", require("./routes/dishRoute"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));
// Global Error Handler
app.use(globalErrorHandler);

// server
app.listen(PORT, () => {
  console.log(`POS Server is listeing on PORT: ${PORT}`);
});
