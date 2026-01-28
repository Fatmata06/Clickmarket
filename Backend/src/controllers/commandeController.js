const Commande = require("../models/Commande");
const Produit = require("../models/Produit");
const ZoneLivraison = require("../models/ZoneLivraison");
const Panier = require("../models/Panier");

const STATUTS_AUTORISES = [
  "en_attente",
  "confirmee",
  "en_cours",
  "expediee",
  "livree",
  "annulee",
];

exports.creerCommande = async (req, res) => {
  try {
    // console.log("========== CRÉER COMMANDE ==========");
    // console.log("req.user:", req.user);
    // console.log("req.body:", req.body);

    const { adresseLivraison, zoneLivraison, dateLivraison, aLivrer } =
      req.body;
    const utilisateur = req.user?.id || req.body.utilisateur;

    if (!utilisateur) {
      return res.status(400).json({ message: "Utilisateur requis" });
    }

    // Récupérer le panier de l'utilisateur
    const panier = await Panier.findOne({ utilisateur }).populate(
      "articles.produit",
    );

    if (!panier) {
      return res.status(404).json({
        message: "Panier introuvable. Veuillez d'abord ajouter des articles.",
      });
    }

    if (!panier.articles || panier.articles.length === 0) {
      return res.status(400).json({
        message:
          "Votre panier est vide. Veuillez ajouter des articles avant de commander.",
      });
    }

    // Hydrater les articles du panier avec les informations complètes
    const articlesHydrates = panier.articles.map((article) => {
      const produit = article.produit;
      if (!produit) {
        const err = new Error("Produit introuvable dans le panier");
        err.status = 404;
        throw err;
      }

      return {
        produit: produit._id,
        nomProduit: produit.nomProduit,
        quantite: article.quantite,
        prixUnitaire: produit.prix,
        total: article.quantite * produit.prix,
      };
    });

    let zone = null;
    let fraisLivraison = 0;

    // Gestion de la livraison
    const livraisonActive = aLivrer !== false; // Par défaut true

    if (livraisonActive) {
      // Si livraison demandée, l'adresse et la zone sont requises
      if (!adresseLivraison) {
        return res
          .status(400)
          .json({ message: "Adresse de livraison requise" });
      }

      if (!zoneLivraison) {
        return res.status(400).json({ message: "Zone de livraison requise" });
      }

      // Récupérer la zone de livraison et ses frais
      zone = await ZoneLivraison.findOne({
        _id: zoneLivraison,
        estActive: true,
      });

      if (!zone) {
        return res
          .status(404)
          .json({ message: "Zone de livraison introuvable ou inactive" });
      }

      // Les frais de livraison viennent de la zone
      fraisLivraison = Number(zone.prix) || 0;
    }

    // Calculer le montant total
    const totalArticles = articlesHydrates.reduce(
      (acc, item) => acc + item.total,
      0,
    );
    const montantTotal = totalArticles + fraisLivraison;

    // Créer la commande
    const commande = await Commande.create({
      utilisateur,
      articles: articlesHydrates,
      montantTotal,
      fraisLivraison,
      adresseLivraison: livraisonActive ? adresseLivraison : undefined,
      aLivrer: livraisonActive,
      zoneLivraison: zone ? zone._id : undefined,
      dateLivraison: livraisonActive ? dateLivraison : undefined,
    });

    // Vider le panier après création réussie de la commande
    panier.articles = [];
    await panier.save();

    res.status(201).json({
      message: "Commande creee avec succes",
      commande,
      panierVide: true,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.listerCommandes = async (req, res) => {
  try {
    const filtre = {};
    if (!req.user || req.user.role !== "admin") {
      filtre.utilisateur = req.user?.id;
    }

    if (req.query.statut && STATUTS_AUTORISES.includes(req.query.statut)) {
      filtre.statutCommande = req.query.statut;
    }

    const commandes = await Commande.find(filtre)
      .sort({ createdAt: -1 })
      .populate("zoneLivraison")
      .populate("articles.produit", "nomProduit prix");

    res.json({ commandes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recupererCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate("zoneLivraison")
      .populate("articles.produit", "nomProduit prix");

    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    if (
      req.user?.role !== "admin" &&
      String(commande.utilisateur) !== req.user?.id
    ) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    res.json({ commande });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.mettreAJourStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    if (!STATUTS_AUTORISES.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    commande.statutCommande = statut;
    await commande.save();

    res.json({ message: "Statut mis a jour", commande });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.annulerCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    const isOwner = req.user && String(commande.utilisateur) === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    if (["livree", "annulee"].includes(commande.statutCommande)) {
      return res.status(400).json({ message: "Commande deja finalisee" });
    }

    commande.statutCommande = "annulee";
    await commande.save();
    res.json({ message: "Commande annulee", commande });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/commandes/:id/adresse - Modifier l'adresse de livraison
exports.modifierAdresseLivraison = async (req, res) => {
  try {
    const { adresseLivraison } = req.body;

    if (!adresseLivraison || adresseLivraison.trim().length === 0) {
      return res.status(400).json({ message: "Adresse de livraison requise" });
    }

    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // Vérifier que c'est le propriétaire ou un admin
    const isOwner = String(commande.utilisateur) === req.user?.id;
    if (!isOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acces refuse" });
    }

    // Ne peut modifier que si la commande n'est pas livrée ou annulée
    if (["livree", "annulee"].includes(commande.statutCommande)) {
      return res.status(400).json({
        message: "Impossible de modifier l'adresse d'une commande finalisée",
      });
    }

    const ancienneAdresse = commande.adresseLivraison;
    commande.adresseLivraison = adresseLivraison;

    // Enregistrer la modification dans l'historique
    await commande.enregistrerModification(
      "adresseLivraison",
      ancienneAdresse,
      adresseLivraison,
      req.user.id,
      "Modification de l'adresse par le client",
    );

    await commande.populate("articles.produit");
    res.json({
      message: "Adresse de livraison modifiée avec succès",
      commande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/commandes/:id/commentaires - Ajouter un commentaire
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { texte } = req.body;

    if (!texte || texte.trim().length === 0) {
      return res.status(400).json({ message: "Commentaire requis" });
    }

    if (texte.length > 500) {
      return res
        .status(400)
        .json({ message: "Commentaire trop long (max 500 caractères)" });
    }

    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // Vérifier que c'est le propriétaire ou un admin
    const isOwner = String(commande.utilisateur) === req.user?.id;
    if (!isOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acces refuse" });
    }

    // Ajouter le commentaire
    await commande.ajouterCommentaire(req.user.id, texte);
    await commande.populate("commentaires.auteur", "nom prenom email");

    res.status(201).json({
      message: "Commentaire ajouté avec succès",
      commande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/commandes/:id/commentaires - Récupérer les commentaires
exports.getCommentaires = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate(
      "commentaires.auteur",
      "nom prenom email",
    );

    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // Vérifier l'accès
    const isOwner = String(commande.utilisateur) === req.user?.id;
    if (!isOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acces refuse" });
    }

    res.json({ commentaires: commande.commentaires });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/commandes/:id/historique - Récupérer l'historique des modifications
exports.getHistorique = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate(
      "historique.modifiePar",
      "nom prenom email",
    );

    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // Vérifier l'accès
    const isOwner = String(commande.utilisateur) === req.user?.id;
    if (!isOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acces refuse" });
    }

    res.json({ historique: commande.historique });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/commandes/:id/paiement - Mettre à jour le statut de paiement
exports.mettreAJourPaiement = async (req, res) => {
  try {
    const { statut, montantPaye, methodePaiement, referenceTransaction } =
      req.body;

    if (!statut) {
      return res.status(400).json({ message: "Statut de paiement requis" });
    }

    const STATUTS_PAIEMENT = [
      "en_attente",
      "en_cours",
      "reussi",
      "echoue",
      "rembourse",
      "annule",
    ];
    if (!STATUTS_PAIEMENT.includes(statut)) {
      return res.status(400).json({
        message:
          "Statut de paiement invalide. Doit être l'un de: " +
          STATUTS_PAIEMENT.join(", "),
      });
    }

    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // Seuls les admins ou les fournisseurs peuvent modifier le paiement
    if (req.user?.role !== "admin" && req.user?.role !== "fournisseur") {
      return res.status(403).json({
        message: "Accès refusé. Seuls les admins peuvent modifier le paiement",
      });
    }

    const ancienStatut = commande.paiement.statut;
    const ancienmontantPaye = commande.paiement.montantPaye;

    // Mettre à jour le paiement
    commande.paiement.statut = statut;
    if (montantPaye !== undefined) {
      commande.paiement.montantPaye = montantPaye;
    }
    if (statut === "reussi") {
      commande.paiement.datePaiement = new Date();
    }
    if (methodePaiement) {
      commande.paiement.methodePaiement = methodePaiement;
    }
    if (referenceTransaction) {
      commande.paiement.referenceTransaction = referenceTransaction;
    }

    // Enregistrer dans l'historique
    await commande.enregistrerModification(
      "paiement.statut",
      ancienStatut,
      statut,
      req.user.id,
      `Changement du statut de paiement à ${statut}`,
    );

    if (montantPaye !== undefined && montantPaye !== ancienmontantPaye) {
      await commande.enregistrerModification(
        "paiement.montantPaye",
        ancienmontantPaye,
        montantPaye,
        req.user.id,
        "Mise à jour du montant payé",
      );
    }

    await commande.save();
    await commande.populate("articles.produit");

    res.json({
      message: "Statut de paiement mis à jour avec succès",
      commande,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
