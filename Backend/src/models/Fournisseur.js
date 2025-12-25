const User = require("./User");
const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
  nomEntreprise: { type: String, required: true },
  numeroEntreprise: { type: String },
  localisationEntreprise: { type: String },
  estverifie: { type: Boolean, default: false },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produit" }]
});

const Fournisseur = User.discriminator("fournisseur", fournisseurSchema);
module.exports = Fournisseur;