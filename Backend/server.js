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
const adminRoutes = require("./src/routes/adminRoutes");
const favoriRoutes = require("./src/routes/favoriRoutes");

const app = express();

// Connexion DB
connectDB();

// Middlewares
const frontendUrls = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];
app.use(
  cors({
    origin: frontendUrls,
    credentials: true,
    exposedHeaders: ["X-Session-ID"], // Exposer le header personnalisé
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour gérer sessionId (depuis header pour cross-origin)
app.use((req, res, next) => {
  // Priorité au header X-Session-ID (pour cross-origin)
  const headerSessionId = req.headers["x-session-id"];
  // Fallback sur cookie (pour same-origin)
  const cookieSessionId = req.cookies.cartSessionId;

  const existingSessionId = headerSessionId || cookieSessionId;

  if (existingSessionId) {
    req.sessionId = existingSessionId;
  } else if (!req.user) {
    // Créer un nouveau sessionId
    const sessionId = uuidv4();
    // Retourner le sessionId dans le header de réponse
    res.setHeader("X-Session-ID", sessionId);
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
app.use("/api/admin", adminRoutes);
app.use("/api/favoris", favoriRoutes);

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
