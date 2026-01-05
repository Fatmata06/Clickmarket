const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produitController");
const { auth, isRole } = require("../middleware/auth");

// Route pour créer un nouveau produit
router.post("/", auth, isRole("fournisseur"), produitController.creerProduit);
router.get("/", produitController.getAllProduits);
router.get("/:id", produitController.getProduitById);
router.put("/:id", auth, isRole("fournisseur"), produitController.updateProduit);
router.delete("/:id", auth, isRole("fournisseur"), produitController.deleteProduit);

module.exports = router;