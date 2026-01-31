const express = require("express");
const router = express.Router();
const {
  creerProduit,
  getAllProduits,
  getProduitById,
  updateProduit,
  deleteProduit,
  supprimerImage,
  getCategories,
  accepterProduit,
  refuserProduit,
  getProduitsEnAttente,
} = require("../controllers/produitController");
const { uploadProduit } = require("../config/multer");
const { isRole, auth, optionalAuth } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     UniteVente:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de l'unité
 *           example: "kg"
 *         pas:
 *           type: number
 *           description: Pas d'incrémentation
 *           example: 0.25
 *
 *     ImageProduit:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: URL de l'image
 *         publicId:
 *           type: string
 *           description: ID public Cloudinary
 *
 *     Produit:
 *       type: object
 *       required:
 *         - nomProduit
 *         - typeProduit
 *         - description
 *         - prix
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du produit
 *         nomProduit:
 *           type: string
 *           description: Nom du produit
 *           example: "Pomme Golden"
 *         typeProduit:
 *           type: string
 *           enum: [fruits, legumes]
 *           description: Type de produit
 *           example: "fruits"
 *         description:
 *           type: string
 *           description: Description du produit
 *           example: "Pommes fraîches et croquantes"
 *         prix:
 *           type: number
 *           minimum: 0
 *           description: Prix du produit
 *           example: 2.5
 *         stock:
 *           type: number
 *           minimum: 0
 *           description: Quantité en stock
 *           example: 100
 *         fournisseur:
 *           type: string
 *           description: ID du fournisseur
 *         uniteVente:
 *           $ref: '#/components/schemas/UniteVente'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ImageProduit'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /api/produits:
 *   post:
 *     summary: Créer un nouveau produit avec images
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: Crée un nouveau produit. Réservé aux fournisseurs. Maximum 5 images.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit créé avec succès"
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (non fournisseur)
 *       404:
 *         description: Fournisseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post(
  "/",
  auth,
  isRole("fournisseur"),
  uploadProduit.array("images", 5),
  creerProduit,
);

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Obtenir tous les produits
 *     tags: [Produits]
 *     description: Récupère la liste de tous les produits disponibles
 *     parameters:
 *       - in: query
 *         name: typeProduit
 *         schema:
 *           type: string
 *           enum: [fruits, legumes]
 *         description: Filtrer par type de produit
 *       - in: query
 *         name: fournisseur
 *         schema:
 *           type: string
 *         description: Filtrer par ID de fournisseur
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher dans le nom ou la description
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produits:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Aucun produit trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/", optionalAuth, getAllProduits);

/**
 * @swagger
 * /api/produits/categories:
 *   get:
 *     summary: Récupérer les catégories existantes
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Catégories récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["fruits", "legumes"]
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /api/produits/validation/en-attente:
 *   get:
 *     summary: Récupérer les produits en attente de validation
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: Récupère la liste des produits en attente de validation (admin seulement). Exclut les produits du TRUSTED_FOURNISSEUR.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom de produit
 *     responses:
 *       200:
 *         description: Produits récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produit'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 pages:
 *                   type: number
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Réservé aux admins
 *       500:
 *         description: Erreur serveur
 */
router.get(
  "/validation/en-attente",
  auth,
  isRole(["admin"]),
  getProduitsEnAttente,
);

// Accepter un produit (Admin uniquement)
/**
 * @swagger
 * /api/produits/{id}/accepter:
 *   patch:
 *     summary: Accepter un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: Permet à un administrateur d'accepter un produit.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit accepté avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Réservé aux admins
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/accepter", auth, isRole(["admin"]), accepterProduit);

// Refuser un produit (Admin uniquement)
/**
 * @swagger
 * /api/produits/{id}/refuser:
 *   patch:
 *     summary: Refuser un produit
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: Permet à un administrateur de refuser un produit avec une raison.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - raisonRefus
 *             properties:
 *               raisonRefus:
 *                 type: string
 *                 description: Raison du refus du produit
 *                 example: "Images de mauvaise qualité"
 *     responses:
 *       200:
 *         description: Produit refusé avec succès
 *       400:
 *         description: Raison de refus manquante
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Réservé aux admins
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/refuser", auth, isRole(["admin"]), refuserProduit);

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Obtenir un produit par ID
 *     tags: [Produits]
 *     description: Récupère les détails complets d'un produit spécifique
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", optionalAuth, getProduitById);

// Mettre à jour un produit
/**
 * @swagger
 * /api/produits/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     description: Met à jour un produit existant. Réservé aux fournisseurs. Possibilité d'ajouter de nouvelles images et de supprimer des anciennes.
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
 *                 example: "Pomme Golden Bio"
 *               typeProduit:
 *                 type: string
 *                 enum: [fruits, legumes]
 *                 example: "fruits"
 *               description:
 *                 type: string
 *                 example: "Pommes fraîches et croquantes, cultivées biologiquement"
 *               prix:
 *                 type: number
 *                 minimum: 0
 *                 example: 3.0
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *               fournisseur:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               uniteVente:
 *                 type: string
 *                 description: "JSON stringifié: {\"nom\":\"kg\",\"pas\":0.25}"
 *                 example: "{\"nom\":\"kg\",\"pas\":0.5}"
 *               imagesToDelete:
 *                 type: string
 *                 description: "JSON array des publicId Cloudinary à supprimer"
 *                 example: "[\"clickmarket/produits/abc123\"]"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Nouvelles images à ajouter
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit modifié avec succès"
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
  "/:id",
  auth,
  isRole(["admin", "fournisseur"]),
  uploadProduit.array("images", 5),
  updateProduit,
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
 *     description: Supprime définitivement un produit et toutes ses images. Réservé aux admins et fournisseurs.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit supprimé avec succès"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
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
 *     description: Supprime une image spécifique du tableau d'images d'un produit. Réservé aux admins et fournisseurs.
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
 *         description: ID de l'image dans le tableau images du produit
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image supprimée avec succès"
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Produit ou image non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  "/:id/images/:imageId",
  auth,
  isRole(["admin", "fournisseur"]),
  supprimerImage,
);

module.exports = router;
