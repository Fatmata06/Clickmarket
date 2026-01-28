const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ MongoDB connecté");
    }
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
