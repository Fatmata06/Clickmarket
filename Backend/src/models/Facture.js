const mongoose = require("mongoose");

const ligneFactureSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    nomProduit: {
      type: String,
      required: true,
      trim: true,
    },
    quantite: {
      type: Number,
      required: true,
      min: 1,
    },
    prixUnitaire: {
      type: Number,
      required: true,
      min: 0,
    },
    totalLigne: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const factureSchema = new mongoose.Schema(
  {
    numeroFacture: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
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
    paiement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paiement",
    },
    // Informations client (snapshot au moment de la facture)
    client: {
      nom: { type: String, required: true, trim: true },
      prenom: { type: String, trim: true },
      email: { type: String, required: true, trim: true },
      telephone: { type: String, trim: true },
      adresse: { type: String, trim: true },
    },
    // Détails de la facture
    lignes: {
      type: [ligneFactureSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Au moins une ligne est requise",
      },
    },
    sousTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    fraisLivraison: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxe: {
      type: Number,
      default: 0,
      min: 0,
    },
    tauxTaxe: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    remise: {
      type: Number,
      default: 0,
      min: 0,
    },
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    dateEmission: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateEcheance: {
      type: Date,
    },
    datePaiement: {
      type: Date,
    },
    statutFacture: {
      type: String,
      enum: [
        "brouillon",
        "emise",
        "payee",
        "partiellement_payee",
        "en_retard",
        "annulee",
      ],
      default: "brouillon",
      index: true,
    },
    methodePaiement: {
      type: String,
      enum: [
        "carte_bancaire",
        "mobile_money",
        "orange_money",
        "wave",
        "especes",
        "virement_bancaire",
        "autre",
      ],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    termes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    // URL du fichier PDF généré
    fichierPDF: {
      type: String,
      trim: true,
    },
    estEnvoyee: {
      type: Boolean,
      default: false,
    },
    dateEnvoi: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Index composés pour optimiser les requêtes
factureSchema.index({ commande: 1 });
factureSchema.index({ utilisateur: 1, createdAt: -1 });
factureSchema.index({ numeroFacture: 1 });
factureSchema.index({ statutFacture: 1, dateEmission: -1 });
factureSchema.index({ dateEcheance: 1, statutFacture: 1 });

// Générer automatiquement un numéro de facture
factureSchema.pre("save", async function (next) {
  if (!this.numeroFacture && this.isNew) {
    const date = new Date();
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");

    // Compter le nombre de factures ce mois-ci
    const count = await mongoose.model("Facture").countDocuments({
      createdAt: {
        $gte: new Date(annee, date.getMonth(), 1),
        $lt: new Date(annee, date.getMonth() + 1, 1),
      },
    });

    const numero = String(count + 1).padStart(4, "0");
    this.numeroFacture = `FAC-${annee}${mois}-${numero}`;
  }
  next();
});

// Calculer automatiquement les totaux
factureSchema.pre("save", function (next) {
  // Calculer le sous-total
  this.sousTotal = this.lignes.reduce((acc, ligne) => {
    ligne.totalLigne = ligne.quantite * ligne.prixUnitaire;
    return acc + ligne.totalLigne;
  }, 0);

  // Calculer la taxe si un taux est défini
  if (this.tauxTaxe > 0) {
    this.taxe = (this.sousTotal * this.tauxTaxe) / 100;
  }

  // Calculer le montant total
  this.montantTotal =
    this.sousTotal + this.fraisLivraison + this.taxe - this.remise;

  next();
});

// Mettre à jour le statut en fonction de la date d'échéance
factureSchema.pre("save", function (next) {
  if (this.statutFacture === "emise" && this.dateEcheance) {
    const maintenant = new Date();
    if (maintenant > this.dateEcheance) {
      this.statutFacture = "en_retard";
    }
  }
  next();
});

// Méthode pour marquer comme payée
factureSchema.methods.marquerPayee = async function (
  datePaiement,
  methodePaiement,
) {
  this.statutFacture = "payee";
  this.datePaiement = datePaiement || new Date();
  if (methodePaiement) {
    this.methodePaiement = methodePaiement;
  }
  return await this.save();
};

// Méthode pour émettre la facture
factureSchema.methods.emettre = async function () {
  this.statutFacture = "emise";
  this.dateEmission = new Date();

  // Définir la date d'échéance (par défaut 30 jours)
  if (!this.dateEcheance) {
    const echeance = new Date();
    echeance.setDate(echeance.getDate() + 30);
    this.dateEcheance = echeance;
  }

  return await this.save();
};

// Méthode pour envoyer la facture
factureSchema.methods.marquerEnvoyee = async function () {
  this.estEnvoyee = true;
  this.dateEnvoi = new Date();
  return await this.save();
};

module.exports = mongoose.model("Facture", factureSchema);
