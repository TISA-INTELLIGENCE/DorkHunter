const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dorkhunter";

    await mongoose.connect(MONGO_URI);
    console.log(`Connected to DB.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(-1);
  }
};

module.exports = ConnectDB;
