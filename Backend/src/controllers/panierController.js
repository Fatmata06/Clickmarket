const Panier = require("../models/Panier");
const Produit = require("../models/Produit");

// @desc    Récupérer ou créer un panier
// @param   {ObjectId|null} userId - ID de l'utilisateur connecté ou null
const getOrCreatePanier = async (userId, sessionId) => {
  // Priorité à l'utilisateur connecté
  let query = userId
    ? { utilisateur: userId }
    : { sessionId, utilisateur: null };

  let panier = await Panier.findOne(query).populate("articles.produit");

  if (!panier) {
    panier = new Panier({
      utilisateur: userId || null,
      sessionId: !userId ? sessionId : null, // ⬅️ Ne pas stocker sessionId si user connecté
    });
    await panier.save();
  } else if (userId && sessionId && !panier.utilisateur) {
    // Merge : panier invité → panier utilisateur
    const panierInvite = await Panier.findOne({ sessionId, utilisateur: null });
    if (panierInvite) {
      // Fusionner les articles
      panierInvite.articles.forEach((articleInvite) => {
        const articleExistant = panier.articles.find(
          (a) => a.produit.toString() === articleInvite.produit.toString()
        );
        if (articleExistant) {
          articleExistant.quantite += articleInvite.quantite;
        } else {
          panier.articles.push(articleInvite);
        }
      });
      await panierInvite.deleteOne(); // Supprimer l'ancien panier invité
    }

    panier.utilisateur = userId;
    panier.sessionId = null;
    await panier.save();
    await panier.populate("articles.produit");
  }

  return panier;
};

// GET /api/panier - Récupérer le panier
exports.getPanier = async (req, res) => {
  try {
    const userId = req.user?._id || null; // Si middleware auth
    const sessionId = req.cookies.cartSessionId || req.headers["x-session-id"];

    const panier = await getOrCreatePanier(userId, sessionId);
    res.json({ message: "Panier récupéré avec succès", panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/panier/ajouter - Ajouter un article
exports.ajouterArticle = async (req, res) => {
  try {
    const { produitId, quantite = 1 } = req.body;
    console.log("Ajouter au panier:", produitId, quantite);
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
    const sessionId = req.cookies.cartSessionId || req.headers["x-session-id"];

    let panier = await getOrCreatePanier(userId, sessionId);

    const articleExistant = panier.articles.find(
      (a) => a.produit.toString() === produitId
    );

    if (articleExistant) {
      articleExistant.quantite += quantite;
    } else {
      panier.articles.push({
        produit: produitId,
        quantite,
        prixUnitaire: produit.prix,
      });
    }

    await panier.save();
    await panier.populate("articles.produit");
    res.json({ message: "Article ajouté avec succès", panier });
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
    const sessionId = req.cookies.cartSessionId || req.headers["x-session-id"];

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

    res.json({
      message: "Article modifié avec succès",
      panier,
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
    const sessionId = req.cookies.cartSessionId || req.headers["x-session-id"];

    const panier = await getOrCreatePanier(userId, sessionId);

    const article = panier.articles.id(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    article.deleteOne(); // ✅ suppression propre

    await panier.save();
    await panier.populate("articles.produit");

    res.json({ message: "Article supprimé avec succès", panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// /api/panier/vider - Vider le panier
exports.viderPanier = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const sessionId = req.cookies.cartSessionId || req.headers["x-session-id"];
    const panier = await getOrCreatePanier(userId, sessionId);

    panier.articles = [];
    await panier.save();
    await panier.populate("articles.produit");
    res.json({ message: "Panier vidé avec succès", panier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/panier/merge (optionnel) - Appelé après login pour forcer merge
exports.mergePanierAfterLogin = async (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.cookies.cartSessionId;
    const userId = req.user?._id;

    if (!sessionId || !userId) {
      return res.status(400).json({
        message: "Données insuffisantes pour fusionner le panier",
      });
    }

    const panier = await getOrCreatePanier(userId, sessionId);

    res.json({
      message: "Paniers fusionnés avec succès",
      panier,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

