const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articles: [
      {
        produit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Produit",
        },
        nomProduit: String, // 🔥 IMPORTANT
        quantite: Number,
        prixUnitaire: Number,
        total: Number, // quantite * prixUnitaire
      },
    ],
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
      type: String,
      enum: ["en_attente", "confirmée", "expédiée", "livrée", "annulée"],
      default: "en_attente",
    },
    adresseLivraison: {
      type: String,
      required: true,
    },
    zoneLivraison: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZoneLivraison",
    },
    dateCommande: {
      type: Date,
      default: Date.now,
    },
    dateLivraison: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commande", commandeSchema);
