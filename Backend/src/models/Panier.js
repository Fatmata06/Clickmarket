const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0,
  },
});

const panierSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur", // Corrige le nom si ton modèle User s'appelle Utilisateur
      sparse: true, // Permet null avec index unique
    },
    sessionId: {
      type: String,
      sparse: true,
    },
    articles: [articleSchema],
  },
  { timestamps: true }
);

// Index unique : un seul panier par utilisateur OU par sessionId
panierSchema.index({ utilisateur: 1, sessionId: 1 }, { unique: true });

// Virtual pour calculer le total dynamiquement
panierSchema.virtual("montantTotal").get(function () {
  return this.articles.reduce((total, article) => {
    return total + article.quantite * article.prixUnitaire;
  }, 0);
});

const Panier = mongoose.model("Panier", panierSchema);

module.exports = Panier;