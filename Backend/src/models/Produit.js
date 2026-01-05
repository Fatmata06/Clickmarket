const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema(
  {
    nomProduit: { type: String, required: true },
    typeProduit: { type: String, enum: ["fruits", "legumes"], required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true },
    estActif: { type: Boolean, default: true },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fournisseur",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Produit", produitSchema);
