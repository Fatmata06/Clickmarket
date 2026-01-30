const mongoose = require("mongoose");
const Produit = require("../models/Produit");
const Fournisseur = require("../models/Fournisseur");
const {
  cloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");

// Création d'un nouveau produit
exports.creerProduit = async (req, res) => {
  try {
    const {
      nomProduit,
      typeProduit,
      description,
      prix,
      stock,
      uniteVente,
      rating,
      reviewsCount,
      tags,
    } = req.body;

    if (!nomProduit || !typeProduit || !description || !prix || !stock) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Au moins une image est requise",
      });
    }

    if (
      !req.user ||
      !req.user.id ||
      !req.user.role ||
      req.user.role !== "fournisseur"
    ) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié ou autorisé.",
      });
    }

    // Vérifier si le produit existe déjà
    const produitExiste = await Produit.findOne({ nomProduit, description });
    if (produitExiste) {
      return res.status(400).json({
        success: false,
        message: "Un produit avec ce nom existe déjà.",
      });
    }

    if (!["fruits", "legumes"].includes(typeProduit)) {
      return res.status(400).json({
        success: false,
        message: "Le type de produit doit être 'fruits' ou 'legumes'.",
      });
    }

    const fournisseurExiste = await Fournisseur.findById(req.user.id);
    if (!fournisseurExiste) {
      return res.status(404).json({
        success: false,
        message: "Fournisseur non trouvé.",
      });
    }

    const trustedEmails = (process.env.TRUSTED_FOURNISSEUR_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const trustedIds = (process.env.TRUSTED_FOURNISSEUR_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const isTrustedFournisseur =
      trustedIds.includes(fournisseurExiste._id.toString()) ||
      trustedEmails.includes((req.user.email || "").toLowerCase());

    const imagesToUpload = [];
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const uploaded = await uploadBufferToCloudinary(
        file.buffer,
        "clickmarche/produits",
      );
      imagesToUpload.push({ url: uploaded.url, publicId: uploaded.publicId });
    }

    const nouveauProduit = new Produit({
      nomProduit,
      typeProduit,
      description,
      prix,
      stock,
      fournisseur: fournisseurExiste._id,
      images: imagesToUpload,
      uniteVente: uniteVente ? JSON.parse(uniteVente) : undefined,
      rating: rating || 4.5,
      reviewsCount: reviewsCount || 0,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      statutValidation: isTrustedFournisseur ? "accepte" : "en_attente",
      dateValidation: isTrustedFournisseur ? new Date() : null,
    });

    const produitEnregistre = await nouveauProduit.save();
    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product: produitEnregistre,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Récupérer tous les produits avec filtres, tri et pagination
exports.getAllProduits = async (req, res) => {
  try {
    const {
      categorie,
      typeProduit,
      minPrice,
      maxPrice,
      inStock,
      tags,
      sort,
      page = 1,
      limit = 12,
      search,
      fournisseur,
      includeNonValides,
    } = req.query;

    // Construire les filtres
    const filters = { estActif: true };

    if (categorie) {
      filters.typeProduit = categorie;
    }
    if (typeProduit) {
      filters.typeProduit = typeProduit;
    }
    if (fournisseur) {
      filters.fournisseur = fournisseur;
    }

    // Filtre de validation (par défaut: seulement les produits acceptés)
    const wantsNonValides = includeNonValides === "true";
    const userRole = req.user?.role;
    const isAdmin = userRole === "admin";
    const isFournisseur = userRole === "fournisseur";

    if (!wantsNonValides || (!isAdmin && !isFournisseur)) {
      filters.statutValidation = "accepte";
    } else if (isFournisseur) {
      filters.fournisseur = req.user.id;
    }

    // Filtre de recherche par nom
    if (search) {
      filters.nomProduit = { $regex: search, $options: "i" };
    }

    // Filtre de prix
    if (minPrice || maxPrice) {
      filters.prix = {};
      if (minPrice) {
        filters.prix.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filters.prix.$lte = parseFloat(maxPrice);
      }
    }

    // Filtre de stock
    if (inStock === "true") {
      filters.stock = { $gt: 0 };
    }

    // Filtre par tags
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = { $in: tagsArray };
    }

    // Construire le tri
    const sortMap = {
      "price-asc": { prix: 1 },
      "price-desc": { prix: -1 },
      newest: { createdAt: -1 },
      popular: { reviewsCount: -1 },
      rating: { rating: -1 },
    };

    const sortBy = sortMap[sort] || { _id: -1 };

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Récupérer les produits
    const produits = await Produit.find(filters)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Compter le total
    const total = await Produit.countDocuments(filters);

    if (!produits || produits.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        total: 0,
        page: pageNum,
        pages: 0,
        message: "Aucun produit trouvé",
      });
    }

    res.status(200).json({
      success: true,
      products: produits,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      message: "Produits récupérés avec succès",
    });
  } catch (error) {
    console.error("Erreur dans getAllProduits:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id).populate(
      "fournisseur",
      "nomEntreprise email",
    );

    if (!produit) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    if (produit.statutValidation !== "accepte") {
      const isAdmin = req.user?.role === "admin";
      const isOwner =
        req.user?.role === "fournisseur" &&
        produit.fournisseur?.toString() === req.user.id;

      if (!isAdmin && !isOwner) {
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }
    }
    res.status(200).json({
      success: true,
      product: produit,
      message: "Produit récupéré avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res) => {
  try {
    const {
      nomProduit,
      typeProduit,
      description,
      prix,
      stock,
      fournisseur,
      imagesToDelete,
      uniteVente,
    } = req.body;

    const produit = await Produit.findById(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifier que l'utilisateur est soit le propriétaire du produit, soit un admin
    if (
      req.user.role !== "admin" &&
      produit.fournisseur.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce produit",
      });
    }

    if (nomProduit !== undefined) produit.nomProduit = nomProduit;
    if (typeProduit !== undefined) produit.typeProduit = typeProduit;
    if (description !== undefined) produit.description = description;
    if (prix !== undefined) produit.prix = prix;
    if (stock !== undefined) produit.stock = stock;
    if (fournisseur !== undefined) produit.fournisseur = fournisseur;
    if (uniteVente !== undefined) produit.uniteVente = JSON.parse(uniteVente);

    // Suppression ciblée d'images si demandé
    let toDelete = [];
    if (imagesToDelete) {
      try {
        toDelete = Array.isArray(imagesToDelete)
          ? imagesToDelete
          : JSON.parse(imagesToDelete); // cas multipart stringifié
      } catch (_) {
        // format non JSON => ignoré
      }
    }

    if (toDelete.length > 0) {
      for (const identifier of toDelete) {
        const imageById = produit.images.id(identifier);
        const imageByPublicId = produit.images.find(
          (img) => img.publicId === identifier,
        );
        const image = imageById || imageByPublicId;
        const publicId = image?.publicId || identifier;

        if (publicId) {
          await deleteFromCloudinary(publicId);
        }

        if (imageById) {
          produit.images.pull(imageById._id);
        } else if (imageByPublicId) {
          produit.images = produit.images.filter(
            (img) => img.publicId !== identifier,
          );
        }
      }
    }

    // Ajout de nouvelles images
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const uploaded = await uploadBufferToCloudinary(
        file.buffer,
        "clickmarket/produits",
      );
      produit.images.push({ url: uploaded.url, publicId: uploaded.publicId });
    }

    await produit.save();
    res.json({ message: "Produit modifié avec succès", produit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifier que l'utilisateur est soit le propriétaire du produit, soit un admin
    if (
      req.user.role !== "admin" &&
      produit.fournisseur.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer ce produit",
      });
    }

    for (const img of produit.images || []) {
      await deleteFromCloudinary(img.publicId);
    }

    await Produit.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une image spécifique d’un produit
exports.supprimerImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const produit = await Produit.findById(id);

    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifier que l'utilisateur est soit le propriétaire du produit, soit un admin
    if (
      req.user.role !== "admin" &&
      produit.fournisseur.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce produit",
      });
    }

    const image = produit.images.id(imageId);
    if (!image) return res.status(404).json({ message: "Image non trouvée" });

    await deleteFromCloudinary(image.publicId);
    produit.images.pull(imageId);
    await produit.save();

    res.json({ message: "Image supprimée avec succès", produit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les catégories de produits existantes
exports.getCategories = async (req, res) => {
  try {
    const categories = await Produit.distinct("typeProduit", {
      estActif: true,
      statutValidation: "accepte",
    });

    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        categories: ["fruits", "legumes"],
        message: "Catégories par défaut",
      });
    }

    res.status(200).json({
      success: true,
      categories,
      message: "Catégories récupérées avec succès",
    });
  } catch (error) {
    console.error("Erreur dans getCategories:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accepter un produit (Admin uniquement)
exports.accepterProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    produit.statutValidation = "accepte";
    produit.raisonRefus = null;
    produit.dateValidation = new Date();
    await produit.save();

    res.json({
      message: "Produit accepté avec succès",
      produit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refuser un produit (Admin uniquement)
exports.refuserProduit = async (req, res) => {
  try {
    const { raisonRefus } = req.body;

    if (!raisonRefus || raisonRefus.trim() === "") {
      return res.status(400).json({
        message: "Veuillez fournir une raison de refus",
      });
    }

    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    produit.statutValidation = "refuse";
    produit.raisonRefus = raisonRefus;
    produit.dateValidation = new Date();
    await produit.save();

    res.json({
      message: "Produit refusé avec succès",
      produit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
