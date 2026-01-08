const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true }, // ex: "Zone A"
    code: { type: String, unique: true },
    prix: { type: Number, required: true },
    description: String,
    estActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ZoneLivraison", zoneSchema);
