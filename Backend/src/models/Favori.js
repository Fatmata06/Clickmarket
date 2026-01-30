const mongoose = require("mongoose");

const options = {
  timestamps: { createdAt: "dateCreation", updatedAt: "dateModification" },
};

const favoriSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
  },
  options,
);

// Index unique pour éviter les doublons (un utilisateur ne peut aimer un produit qu'une seule fois)
favoriSchema.index({ utilisateur: 1, produit: 1 }, { unique: true });

module.exports = mongoose.model("Favori", favoriSchema);
