const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    nomProduit: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    uniteVente: {
      nom: { type: String, enum: ["kg", "litre", "piece"] },
      pas: { type: Number }, // ex: 0.25 kg
    },
    typeProduit: {
      type: String,
      enum: ["fruits", "legumes"],
      required: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    estActif: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        enum: ["Bio", "Local", "Exotique", "Frais", "Promo", "Nouveau"],
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Statut de validation par l'administrateur
    statutValidation: {
      type: String,
      enum: ["en_attente", "accepte", "refuse"],
      default: "accepte", // Par défaut accepté - Changer en "en_attente" pour bloquer les produits tant que l'admin ne les valide pas
    },
    raisonRefus: {
      type: String,
      default: null,
    },
    dateValidation: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Produit", produitSchema);
