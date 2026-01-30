const Favori = require("../models/Favori");
const Produit = require("../models/Produit");

/**
 * @swagger
 * /api/favoris:
 *   get:
 *     tags: [Favoris]
 *     summary: Récupérer tous les favoris de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 */
exports.getFavoris = async (req, res) => {
  try {
    const favoris = await Favori.find({ utilisateur: req.user._id })
      .populate({
        path: "produit",
        populate: {
          path: "fournisseur",
          select: "nom prenom nomEntreprise",
        },
      })
      .sort({ dateCreation: -1 });

    res.status(200).json({
      success: true,
      count: favoris.length,
      favoris: favoris.map((f) => f.produit),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des favoris",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/favoris/{produitId}:
 *   post:
 *     tags: [Favoris]
 *     summary: Ajouter un produit aux favoris
 *     security:
 *       - bearerAuth: []
 */
exports.ajouterFavori = async (req, res) => {
  try {
    const { produitId } = req.params;

    // Vérifier si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    // Vérifier si le favori existe déjà
    const favoriExistant = await Favori.findOne({
      utilisateur: req.user._id,
      produit: produitId,
    });

    if (favoriExistant) {
      return res.status(400).json({
        success: false,
        message: "Ce produit est déjà dans vos favoris",
      });
    }

    // Créer le favori
    const favori = await Favori.create({
      utilisateur: req.user._id,
      produit: produitId,
    });

    res.status(201).json({
      success: true,
      message: "Produit ajouté aux favoris",
      favori,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout aux favoris",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/favoris/{produitId}:
 *   delete:
 *     tags: [Favoris]
 *     summary: Retirer un produit des favoris
 *     security:
 *       - bearerAuth: []
 */
exports.retirerFavori = async (req, res) => {
  try {
    const { produitId } = req.params;

    const favori = await Favori.findOneAndDelete({
      utilisateur: req.user._id,
      produit: produitId,
    });

    if (!favori) {
      return res.status(404).json({
        success: false,
        message: "Ce produit n'est pas dans vos favoris",
      });
    }

    res.status(200).json({
      success: true,
      message: "Produit retiré des favoris",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du favori",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/favoris/check/{produitId}:
 *   get:
 *     tags: [Favoris]
 *     summary: Vérifier si un produit est dans les favoris
 *     security:
 *       - bearerAuth: []
 */
exports.verifierFavori = async (req, res) => {
  try {
    const { produitId } = req.params;

    const favori = await Favori.findOne({
      utilisateur: req.user._id,
      produit: produitId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favori,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du favori",
      error: error.message,
    });
  }
};
