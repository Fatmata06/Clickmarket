const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    nomProduit: { type: String, trim: true, maxlength: 150, required: true },
    quantite: { type: Number, required: true, min: 1 },
    prixUnitaire: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const historiqueModificationSchema = new mongoose.Schema(
  {
    champ: { type: String, required: true },
    ancienneValeur: { type: mongoose.Schema.Types.Mixed },
    nouvelleValeur: { type: mongoose.Schema.Types.Mixed },
    modifiePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateModification: { type: Date, default: Date.now },
    raison: { type: String, trim: true, maxlength: 200 },
  },
  { _id: true },
);

const historiqueStatutSchema = new mongoose.Schema(
  {
    ancienStatut: { type: String, required: true },
    nouveauStatut: { type: String, required: true },
    modifiePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateModification: { type: Date, default: Date.now },
    raison: { type: String, trim: true, maxlength: 200 },
  },
  { _id: true },
);

const commentaireSchema = new mongoose.Schema(
  {
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    texte: { type: String, trim: true, maxlength: 500, required: true },
    dateCreation: { type: Date, default: Date.now },
  },
  { _id: true },
);

const commandeSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    articles: {
      type: [articleSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Au moins un article est requis",
      },
    },
    montantTotal: { type: Number, required: true, min: 0, default: 0 },
    fraisLivraison: { type: Number, default: 0, min: 0 },
    statutCommande: {
      type: String,
      enum: [
        "en_attente",
        "confirmee",
        "en_cours",
        "expediee",
        "livree",
        "annulee",
      ],
      default: "en_attente",
      index: true,
    },
    adresseLivraison: {
      type: String,
      trim: true,
      maxlength: 300,
      required: function () {
        return this.aLivrer === true;
      },
    },
    aLivrer: { type: Boolean, default: true },
    zoneLivraison: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZoneLivraison",
      required: function () {
        return this.aLivrer === true;
      },
    },
    dateCommande: { type: Date, default: Date.now },
    dateLivraison: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= this.dateCommande;
        },
        message: "La date de livraison doit etre posterieure a la commande",
      },
    },
    // Nouveaux champs
    commentaires: {
      type: [commentaireSchema],
      default: [],
    },
    historique: {
      type: [historiqueModificationSchema],
      default: [],
    },
    historiqueStatuts: {
      type: [historiqueStatutSchema],
      default: [],
    },
    paiement: {
      statut: {
        type: String,
        enum: [
          "en_attente",
          "en_cours",
          "reussi",
          "echoue",
          "rembourse",
          "annule",
        ],
        default: "en_attente",
      },
      montantPaye: { type: Number, default: 0, min: 0 },
      datePaiement: Date,
      methodePaiement: { type: String, trim: true },
      referenceTransaction: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

commandeSchema.index({ utilisateur: 1, dateCommande: -1 });
commandeSchema.index({ statutCommande: 1, dateCommande: -1 });

// Méthode pour ajouter un commentaire
commandeSchema.methods.ajouterCommentaire = function (auteurId, texte) {
  this.commentaires.push({
    auteur: auteurId,
    texte,
    dateCreation: new Date(),
  });
  return this.save();
};

// Méthode pour enregistrer une modification dans l'historique
commandeSchema.methods.enregistrerModification = function (
  champ,
  ancienneValeur,
  nouvelleValeur,
  modifiePar,
  raison = "",
) {
  this.historique.push({
    champ,
    ancienneValeur,
    nouvelleValeur,
    modifiePar,
    dateModification: new Date(),
    raison,
  });
  return this.save();
};

// Méthode pour enregistrer un changement de statut dans l'historique
commandeSchema.methods.enregistrerChangementStatut = function (
  ancienStatut,
  nouveauStatut,
  modifiePar,
  raison = "",
) {
  this.historiqueStatuts.push({
    ancienStatut,
    nouveauStatut,
    modifiePar,
    dateModification: new Date(),
    raison,
  });
  return this.save();
};

// Middleware pré-validation
commandeSchema.pre("validate", async function () {
  if (!this.aLivrer) {
    this.fraisLivraison = 0;
    this.zoneLivraison = undefined;
    this.dateLivraison = undefined;
  } else if (this.zoneLivraison && this.isModified("zoneLivraison")) {
    // Si zoneLivraison est définie, récupérer automatiquement le prix
    try {
      const ZoneLivraison = mongoose.model("ZoneLivraison");
      const zone = await ZoneLivraison.findById(this.zoneLivraison);
      if (zone) {
        this.fraisLivraison = zone.prix;
      }
    } catch (error) {
      // Si erreur, continuer sans bloquer
      console.error(
        "Erreur lors de la récupération du prix de la zone:",
        error,
      );
    }
  }
});

commandeSchema.pre("validate", function () {
  this.articles = (this.articles || []).map((item) => {
    const quantite = Number(item.quantite) || 0;
    const prixUnitaire = Number(item.prixUnitaire) || 0;
    const total = quantite * prixUnitaire;
    return { ...item, quantite, prixUnitaire, total };
  });

  const totalArticles = (this.articles || []).reduce(
    (acc, curr) => acc + (Number(curr.total) || 0),
    0,
  );
  const frais = Number(this.fraisLivraison) || 0;
  this.montantTotal = Number(totalArticles) + frais;
});

module.exports = mongoose.model("Commande", commandeSchema);
