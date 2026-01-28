const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema(
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
    adresseLivraison: {
      rue: { type: String, trim: true, required: true },
      ville: { type: String, trim: true, required: true },
      codePostal: { type: String, trim: true },
      quartier: { type: String, trim: true },
      complementAdresse: { type: String, trim: true },
      telephone: { type: String, trim: true, required: true },
    },
    zoneLivraison: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZoneLivraison",
      required: true,
    },
    statutLivraison: {
      type: String,
      enum: [
        "en_attente",
        "preparee",
        "en_cours_de_livraison",
        "livree",
        "echec",
        "retournee",
      ],
      default: "en_attente",
      index: true,
    },
    livreur: {
      nom: { type: String, trim: true },
      telephone: { type: String, trim: true },
      vehicule: { type: String, trim: true },
    },
    datePrevueLivraison: {
      type: Date,
      required: true,
    },
    dateLivraisonEffective: {
      type: Date,
    },
    dateDepart: {
      type: Date,
    },
    heureDepart: {
      type: String,
      trim: true,
    },
    heureArrivee: {
      type: String,
      trim: true,
    },
    numeroSuivi: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    fraisLivraison: {
      type: Number,
      required: true,
      min: 0,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    noteClient: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    signatureReception: {
      type: String, // Peut contenir une URL d'image de signature
    },
    nomReceptionnaire: {
      type: String,
      trim: true,
    },
    commentaireLivraison: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    historiqueStatuts: [
      {
        statut: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        commentaire: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);

// Index composés pour optimiser les requêtes
livraisonSchema.index({ commande: 1 });
livraisonSchema.index({ utilisateur: 1, createdAt: -1 });
livraisonSchema.index({ statutLivraison: 1, datePrevueLivraison: 1 });
livraisonSchema.index({ numeroSuivi: 1 });

// Générer automatiquement un numéro de suivi
livraisonSchema.pre("save", function (next) {
  if (!this.numeroSuivi && this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 10000);
    this.numeroSuivi = `LIV${timestamp}${random}`;
  }
  next();
});

// Ajouter l'historique des statuts lors du changement
livraisonSchema.pre("save", function (next) {
  if (this.isModified("statutLivraison")) {
    this.historiqueStatuts.push({
      statut: this.statutLivraison,
      date: new Date(),
    });

    // Si livraison effectuée, enregistrer la date
    if (this.statutLivraison === "livree" && !this.dateLivraisonEffective) {
      this.dateLivraisonEffective = new Date();
    }

    // Si livraison en cours, enregistrer la date de départ
    if (this.statutLivraison === "en_cours_de_livraison" && !this.dateDepart) {
      this.dateDepart = new Date();
    }
  }
  next();
});

// Méthode pour marquer comme livrée
livraisonSchema.methods.marquerLivree = async function (
  nomReceptionnaire,
  commentaire,
) {
  this.statutLivraison = "livree";
  this.dateLivraisonEffective = new Date();
  this.nomReceptionnaire = nomReceptionnaire;
  if (commentaire) {
    this.commentaireLivraison = commentaire;
  }
  return await this.save();
};

// Méthode pour assigner un livreur
livraisonSchema.methods.assignerLivreur = async function (livreurInfo) {
  this.livreur = livreurInfo;
  this.statutLivraison = "preparee";
  return await this.save();
};

module.exports = mongoose.model("Livraison", livraisonSchema);
