const mongoose = require("mongoose");
const Produit = require("../models/Produit");
const Fournisseur = require("../models/Fournisseur");

// Création d'un nouveau produit
exports.creerProduit = async (req, res) => {
  try {
    const {
      nomProduit,
      typeProduit,
      description,
      image,
      prix,
      stock,
      fournisseur,
    } = req.body;

    if (
      !nomProduit ||
      !typeProduit ||
      !description ||
      !image ||
      !prix ||
      !stock ||
      !fournisseur
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    if (!["fruits", "legumes"].includes(typeProduit)) {
      return res
        .status(400)
        .json({
          message: "Le type de produit doit être 'fruits' ou 'legumes'.",
        });
    }

    const fournisseurExiste = await Fournisseur.findById(fournisseur);
    if (!fournisseurExiste) {
      return res.status(404).json({ message: "Fournisseur non trouvé." });
    }

    const nouveauProduit = new Produit({
      nomProduit,
      typeProduit,
      description,
      image,
      prix,
      stock,
      fournisseur: fournisseurExiste._id,
    });

    const produitEnregistre = await nouveauProduit.save();

    res.status(201).json({
      message: "Produit créé avec succès",
      produit: produitEnregistre,
    });
  } catch (error) {
    console.error("Erreur création produit:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les produits
exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find(req.params.id);
    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    res.status(200).json(
        { produits : produits, message: "Produits récupérés avec succès" }
    );
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
    res.status(200).json({ produit: produit, message: "Produit récupéré avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un produit
exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      req.body,
        { new: true }
    );

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    if (req.body.typeProduit && !["fruits", "legumes"].includes(req.body.typeProduit)) {
      return res
        .status(400)
        .json({
          message: "Le type de produit doit être 'fruits' ou 'legumes'.",
        });
    }

    const fournisseurExiste = await Fournisseur.findById(req.body.fournisseur);
    if (!fournisseurExiste) {
      return res.status(404).json({ message: "Fournisseur non trouvé." });
    }

    res.status(200).json({ produit: produit, message: "Produit mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};