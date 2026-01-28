require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ⬅️ Ajouter
const { v4: uuidv4 } = require("uuid"); // ⬅️ Ajouter
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/docs/swagger");
const authRoutes = require("./src/routes/authRoutes");
const produitRoutes = require("./src/routes/produitRoutes");
const fournisseurRoutes = require("./src/routes/fournisseurRoutes");
const panierRoutes = require("./src/routes/panierRoutes");
const commandeRoutes = require("./src/routes/commandeRoutes");
const zoneLivraisonRoutes = require("./src/routes/zoneLivraisonRoutes");

const app = express();

// Connexion DB
connectDB();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ⬅️ Adapter
app.use(cookieParser()); // ⬅️ Ajouter
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour générer sessionId si absent
app.use((req, res, next) => {
  if (!req.cookies.cartSessionId && !req.user) {
    const sessionId = uuidv4();
    res.cookie("cartSessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    });
    req.sessionId = sessionId;
  }
  next();
});

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/fournisseurs", fournisseurRoutes);
app.use("/api/panier", panierRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/zones-livraison", zoneLivraisonRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API ClickMarket fonctionne 🚀");
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

const mongoose = require("mongoose");

// Connexion à MongoDB avec autoIndex désactivé
mongoose.connect(process.env.MONGO_URI, {
  autoIndex: false,
});
