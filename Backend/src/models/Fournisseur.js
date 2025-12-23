const User = require("./User");
const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
  nomEntreprise: { type: String, required: true },
  numeroEntreprise: { type: String },
  localisationEntreprise: { type: String },
  verifie: { type: Boolean, default: false },
  dateInscription: { type: Date, default: Date.now },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produit" }]
});

const Fournisseur = User.discriminator("fournisseur", fournisseurSchema);
module.exports = Fournisseur;