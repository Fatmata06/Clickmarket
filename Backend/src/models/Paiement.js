const mongoose = require("mongoose");

const paiementSchema = new mongoose.Schema(
  {
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      required: true,
      index: true,
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0,
    },
    methodePaiement: {
      type: String,
      enum: ["carte_bancaire", "mobile_money", "orange_money", "wave", "especes", "virement_bancaire"],
      required: true,
    },
    statutPaiement: {
      type: String,
      enum: ["en_attente", "en_cours", "reussi", "echoue", "rembourse", "annule"],
      default: "en_attente",
      index: true,
    },
    referenceTransaction: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    numeroTelephone: {
      type: String,
      trim: true,
      required: function () {
        return ["mobile_money", "orange_money", "wave"].includes(this.methodePaiement);
      },
    },
    detailsPaiement: {
      type: mongoose.Schema.Types.Mixed,
      // Peut contenir des infos spécifiques au mode de paiement
    },
    datePaiement: {
      type: Date,
    },
    dateValidation: {
      type: Date,
    },
    messageErreur: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index composés pour optimiser les requêtes
paiementSchema.index({ commande: 1, statutPaiement: 1 });
paiementSchema.index({ utilisateur: 1, createdAt: -1 });
paiementSchema.index({ referenceTransaction: 1 });

// Middleware pour définir la date de paiement quand le statut devient "reussi"
paiementSchema.pre("save", function (next) {
  if (this.isModified("statutPaiement") && this.statutPaiement === "reussi" && !this.datePaiement) {
    this.datePaiement = new Date();
  }
  next();
});

// Méthode pour valider le paiement
paiementSchema.methods.valider = async function () {
  this.statutPaiement = "reussi";
  this.dateValidation = new Date();
  if (!this.datePaiement) {
    this.datePaiement = new Date();
  }
  return await this.save();
};

// Méthode pour marquer le paiement comme échoué
paiementSchema.methods.marquerEchoue = async function (messageErreur) {
  this.statutPaiement = "echoue";
  this.messageErreur = messageErreur;
  return await this.save();
};

module.exports = mongoose.model("Paiement", paiementSchema);
