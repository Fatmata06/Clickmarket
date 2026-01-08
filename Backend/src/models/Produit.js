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
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fournisseur",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Produit", produitSchema);
