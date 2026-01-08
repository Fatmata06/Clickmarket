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
    const { nomProduit, typeProduit, description, prix, stock, uniteVente } = req.body;
    
    // console.log("FILES:", req.files);
    // console.log("BODY:", req.body);
    // console.log("User:", req.user);


    if ( !nomProduit || !typeProduit || !description || !prix || !stock ) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Au moins une image est requise" });
    }

    if(!req.user || !req.user.id || !req.user.role || req.user.role !== "fournisseur") {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    // Vérifier si le produit existe déjà
    const produitExiste = await Produit.findOne({ nomProduit, description });
    if (produitExiste) {
      return res.status(400).json({ message: "Un produit avec ce nom existe déjà." });
    }

    if (!["fruits", "legumes"].includes(typeProduit)) {
      return res.status(400).json({  message: "Le type de produit doit être 'fruits' ou 'legumes'.",  });
    }

    const fournisseurExiste = await Fournisseur.findById(req.user.id);
    if (!fournisseurExiste) {
      return res.status(404).json({ message: "Fournisseur non trouvé." });
    }

    const imagesToUpload = [];
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const uploaded = await uploadBufferToCloudinary(
        file.buffer,
        "clickmarche/produits"
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
    });

    const produitEnregistre = await nouveauProduit.save();
    res.status(201).json({ message: "Produit créé avec succès", produit: produitEnregistre });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les produits
exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find();

    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    res
      .status(200)
      .json({ produits: produits, message: "Produits récupérés avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res
      .status(200)
      .json({ produit: produit, message: "Produit récupéré avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      for (const publicId of toDelete) {
        await deleteFromCloudinary(publicId);
        produit.images = produit.images.filter(
          (img) => img.publicId !== publicId
        );
      }
    }

    // Ajout de nouvelles images
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const uploaded = await uploadBufferToCloudinary(
        file.buffer,
        "clickmarket/produits"
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
