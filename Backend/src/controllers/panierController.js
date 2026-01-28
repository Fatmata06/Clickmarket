const Panier = require("../models/Panier");
const Produit = require("../models/Produit");
const mongoose = require("mongoose");

// Fonction utilitaire pour enrichir le panier avec les totaux
const enrichirPanierAvecTotaux = (panier) => {
  if (!panier || !panier.articles) return panier;

  // Ajouter le total à chaque article
  panier.articles = panier.articles.map((article) => ({
    ...(article.toObject ? article.toObject() : article),
    total: article.quantite * article.prixUnitaire,
  }));

  return panier;
};

// @desc    Récupérer ou créer un panier
// @param   {ObjectId|null} userId - ID de l'utilisateur connecté ou null
const getOrCreatePanier = async (userId, sessionId) => {
  // Si utilisateur connecté, chercher son panier
  if (userId) {
    let panier = await Panier.findOne({ utilisateur: userId }).populate(
      "articles.produit",
    );

    // Si panier utilisateur n'existe pas, créer un nouveau
    if (!panier) {
      panier = new Panier({
        utilisateur: userId,
        sessionId: null, // Pas de sessionId pour utilisateur connecté
      });
      await panier.save();
    }

    return panier;
  }

  // Si utilisateur pas connecté, utiliser le sessionId
  if (sessionId) {
    let panier = await Panier.findOne({
      sessionId,
      utilisateur: null,
    }).populate("articles.produit");

    if (!panier) {
      panier = new Panier({
        utilisateur: null,
        sessionId: sessionId,
      });
      await panier.save();
    }

    return panier;
  }

  // Pas d'utilisateur et pas de sessionId
  throw new Error(
    "Impossible de créer un panier sans utilisateur ou sessionId",
  );
};

// GET /api/panier - Récupérer le panier
exports.getPanier = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const sessionId = req.cookies.cartSessionId;
    // console.log("GET PANIER - userId:", req.user, "sessionId:", sessionId);

    let panier = null;

    if (userId) {
      // 1️⃣ PRIORITÉ : panier utilisateur
      panier = await Panier.findOne({ utilisateur: userId }).populate(
        "articles.produit",
      );

      // 2️⃣ Si pas encore de panier utilisateur MAIS panier invité existe
      if (!panier && sessionId) {
        panier = await Panier.findOne({
          sessionId,
          utilisateur: null,
        }).populate("articles.produit");
      }
    } else if (sessionId) {
      // Utilisateur invité
      panier = await Panier.findOne({
        sessionId,
        utilisateur: null,
      }).populate("articles.produit");
    }

    // 3️⃣ Créer panier invité UNIQUEMENT si nécessaire
    if (!panier && !userId && sessionId) {
      panier = await Panier.create({
        sessionId,
        utilisateur: null,
      });
    }

    // Enrichir le panier avec les totaux
    const panierEnrichi = enrichirPanierAvecTotaux(panier);

    res.json({ panier: panierEnrichi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/panier/ajouter - Ajouter un article
exports.ajouterArticle = async (req, res) => {
  try {
    const { produitId, quantite = 1 } = req.body;
    // console.log("Ajouter au panier:", produitId, quantite);
    if (!produitId || quantite < 1) {
      return res
        .status(400)
        .json({ message: "Données invalides pour ajouter l'article." });
    }

    const produit = await Produit.findById(produitId);
    if (!produit || !produit.estActif)
      return res.status(404).json({ message: "Produit non trouvé" });
    if (produit.stock < quantite)
      return res.status(400).json({ message: "Stock insuffisant" });

    const userId = req.user?._id || null;
    // Si userId existe, ignorer sessionId
    const sessionId = userId
      ? null
      : req.sessionId || req.cookies.cartSessionId;

    let panier = await getOrCreatePanier(userId, sessionId);

    // Convertir produitId en ObjectId pour une comparaison correcte
    const produitObjectId = new mongoose.Types.ObjectId(produitId);

    const articleExistant = panier.articles.find((a) =>
      a.produit.equals(produitObjectId),
    );

    let message = "Article ajouté avec succès";

    if (articleExistant) {
      articleExistant.quantite += quantite;
      message = "Quantité mise à jour";
    } else {
      panier.articles.push({
        produit: produitId,
        quantite,
        prixUnitaire: produit.prix,
      });
    }

    await panier.save();
    await panier.populate("articles.produit");

    // Enrichir avec totaux
    const panierEnrichi = enrichirPanierAvecTotaux(panier);

    res.json({ message, panier: panierEnrichi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/panier/article/:articleId
exports.modifierArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { produitId, quantite } = req.body;

    if (!produitId && quantite === undefined) {
      return res.status(400).json({
        message: "Aucune modification fournie",
      });
    }

    const userId = req.user?._id || null;
    // Si userId existe, ignorer sessionId
    const sessionId = userId
      ? null
      : req.sessionId || req.cookies.cartSessionId;

    const panier = await getOrCreatePanier(userId, sessionId);

    const article = panier.articles.id(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    // 🔹 Modifier le produit si fourni
    if (produitId) {
      const produit = await Produit.findById(produitId);
      if (!produit || !produit.estActif) {
        return res.status(404).json({ message: "Produit invalide" });
      }

      article.produit = produitId;
      article.prixUnitaire = produit.prix; // MAJ prix
    }

    // 🔹 Modifier la quantité si fournie
    if (quantite !== undefined) {
      if (quantite <= 0) {
        return res.status(400).json({ message: "Quantité invalide" });
      }
      article.quantite = quantite;
    }

    await panier.save();
    await panier.populate("articles.produit");

    // Enrichir avec totaux
    const panierEnrichi = enrichirPanierAvecTotaux(panier);

    res.json({
      message: "Article modifié avec succès",
      panier: panierEnrichi,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/panier/article/:articleId
exports.supprimerArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const userId = req.user?._id || null;
    // Si userId existe, ignorer sessionId
    const sessionId = userId
      ? null
      : req.cookies.cartSessionId || req.headers["x-session-id"];

    const panier = await getOrCreatePanier(userId, sessionId);

    const article = panier.articles.id(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    article.deleteOne(); // ✅ suppression propre

    await panier.save();
    await panier.populate("articles.produit");

    // Enrichir avec totaux
    const panierEnrichi = enrichirPanierAvecTotaux(panier);

    res.json({
      message: "Article supprimé avec succès",
      panier: panierEnrichi,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// /api/panier/vider - Vider le panier
exports.viderPanier = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    // Si userId existe, ignorer sessionId
    const sessionId = userId
      ? null
      : req.cookies.cartSessionId || req.headers["x-session-id"];
    const panier = await getOrCreatePanier(userId, sessionId);

    panier.articles = [];
    await panier.save();
    await panier.populate("articles.produit");

    // Enrichir avec totaux (panier vide mais cohérent)
    const panierEnrichi = enrichirPanierAvecTotaux(panier);

    res.json({ message: "Panier vidé avec succès", panier: panierEnrichi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/panier/merge - Appel après login pour fusionner le panier invité avec le panier utilisateur
exports.mergePanierAfterLogin = async (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.cookies.cartSessionId;
    const userId = req.user?._id;

    if (!sessionId || !userId) {
      return res.status(400).json({
        message: "Données insuffisantes pour fusionner le panier",
      });
    }

    // 1. Récupérer le panier invité (avec sessionId)
    const panierInvite = await Panier.findOne({
      sessionId: sessionId,
      utilisateur: null,
    }).populate("articles.produit");

    // 2. Récupérer ou créer le panier utilisateur
    let panierUtilisateur = await Panier.findOne({
      utilisateur: userId,
    }).populate("articles.produit");

    if (!panierUtilisateur) {
      panierUtilisateur = new Panier({
        utilisateur: userId,
        sessionId: null,
        articles: [],
      });
    }

    // 3. Fusionner les articles du panier invité dans le panier utilisateur
    if (panierInvite && panierInvite.articles.length > 0) {
      panierInvite.articles.forEach((articleInvite) => {
        const articleExistant = panierUtilisateur.articles.find(
          (a) =>
            a.produit._id.toString() === articleInvite.produit._id.toString(),
        );

        if (articleExistant) {
          // Article existe : augmenter la quantité
          articleExistant.quantite += articleInvite.quantite;
        } else {
          // Article n'existe pas : l'ajouter
          panierUtilisateur.articles.push({
            produit: articleInvite.produit._id,
            quantite: articleInvite.quantite,
            prixUnitaire: articleInvite.prixUnitaire,
          });
        }
      });
    }

    // 4. S'assurer que le panier utilisateur n'a pas de sessionId
    panierUtilisateur.sessionId = null;

    // 5. Sauvegarder le panier utilisateur
    await panierUtilisateur.save();
    await panierUtilisateur.populate("articles.produit");

    // 6. Supprimer le panier invité
    if (panierInvite) {
      await panierInvite.deleteOne();
    }

    res.json({
      message: "Paniers fusionnés avec succès",
      panier: panierUtilisateur,
      sessionIdToDelete: sessionId, // Signale au frontend de nettoyer ce sessionId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
