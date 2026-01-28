const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true }, // ex: "Thies Est"
    code: { type: String, unique: true }, // ex: "ZONE_1"
    prix: { type: Number, min: 0, required: true },
    description: String,
    estActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ZoneLivraison", zoneSchema);

// Données de test
/*
{
  "nom": "Thies Est",
  "code": "ZONE_1",
  "prix": 500,
  "description": "Livraison entre Parcelles Assainies et Keur Massar",
  "estActive": true
}
*/
