const mongoose = require("mongoose");
const config = require("./config");

let isConnected = false; // Menyimpan status koneksi

const connectDB = async () => {
  if (isConnected) {
    return; // Jika sudah konek, langsung balikkan tanpa re-connect ulang
  }

  try {
    const db = await mongoose.connect(config.databaseURI);
    isConnected = db.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Throw error agar ditangkap oleh middleware Express, JANGAN process.exit()
  }
};

module.exports = connectDB;
