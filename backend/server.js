require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");
const connectDB = require("./config/database");
const config = require("./config/config");

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`POS server is listening on port ${config.port}`);
    });

    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) return;

      isShuttingDown = true;
      console.log(`${signal} received. Shutting down...`);

      server.close(async (serverError) => {
        if (serverError) {
          console.error("HTTP server shutdown error:", serverError);
          process.exitCode = 1;
        }

        try {
          await mongoose.connection.close();

          console.log("Server and database connection closed");
          process.exit(process.exitCode || 0);
        } catch (databaseError) {
          console.error("Database shutdown error:", databaseError);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
