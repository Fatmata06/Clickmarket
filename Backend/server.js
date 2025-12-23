require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");



const app = express();

// Connexion DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//API
const authRoutes = require("./src/routes/authRoutes");
const fournisseurRoutes = require('./src/routes/fournisseurRoutes');

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fournisseurs", fournisseurRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API ClickMarket fonctionne 🚀");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
