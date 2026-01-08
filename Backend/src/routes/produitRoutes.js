const express = require("express");
const router = express.Router();
const {
  creerProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  supprimerImage,
} = require("../controllers/produitController");
const { uploadProduit } = require("../config/multer");
const { isRole, auth } = require("../middleware/auth");

// Créer un nouveau produit avec images
/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Créer un nouveau produit avec images
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomProduit
 *               - typeProduit
 *               - description
 *               - prix
 *               - stock
 *               - images
 *             properties:
 *               nomProduit:
 *                 type: string
 *                 example: "Pomme Golden"
 *               typeProduit:
 *                 type: string
 *                 enum: [fruits, legumes]
 *                 example: "fruits"
 *               description:
 *                 type: string
 *                 example: "Pommes fraîches et croquantes"
 *               prix:
 *                 type: number
 *                 minimum: 0
 *                 example: 2.5
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 100
 *               uniteVente:
 *                 type: string
 *                 description: "JSON stringifié: {\"nom\":\"kg\",\"pas\":0.25}"
 *                 example: "{\"nom\":\"kg\",\"pas\":0.25}"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Fournisseur non trouvé
 */
router.post(
  "/",
  auth,
  isRole("fournisseur"),
  uploadProduit.array("images", 5),
  creerProduit
);

//Récupérer tous les produits
/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Obtenir tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits récupérés avec succès
 *       404:
 *         description: Aucun produit trouvé
 */
router.get("/", getAllProduits);

// Obtenir un produit par ID
/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Obtenir un produit par ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit récupérés avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.get("/:id", getProduitById);

// Mettre à jour un produit
/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomProduit:
 *                 type: string
 *                 example: "Pomme Golden"
 *               typeProduit:
 *                 type: string
 *                 enum: [fruits, legumes]
 *                 example: "fruits"
 *               description:
 *                 type: string
 *                 example: "Pommes fraîches et croquantes"
 *               prix:
 *                 type: number
 *                 minimum: 0
 *                 example: 2.5
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 100
 *               fournisseur:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               uniteVente:
 *                 type: string
 *                 description: "JSON stringifié: {\"nom\":\"kg\",\"pas\":0.25}"
 *                 example: "{\"nom\":\"kg\",\"pas\":0.25}"
 *               imagesToDelete:
 *                 type: string
 *                 description: "JSON array des publicId à supprimer"
 *                 example: "[\"clickmarket/produits/abc123\"]"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.put(
  "/:id",
  auth,
  isRole("fournisseur"),
  uploadProduit.array("images", 5),
  updateProduit
);

// Supprimer un produit
/**
 * @swagger
 * /api/produits/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.delete("/:id", auth, isRole(["admin", "fournisseur"]), deleteProduit);

// Supprimer une image spécifique d'un produit
/**
 * @swagger
 * /api/produits/{id}/images/{imageId}:
 *   delete:
 *     summary: Supprimer une image spécifique d'un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'image dans le tableau images
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *       404:
 *         description: Produit ou image non trouvé
 */
router.delete("/:id/images/:imageId", auth, isRole(["admin", "fournisseur"]), supprimerImage);

module.exports = router;
