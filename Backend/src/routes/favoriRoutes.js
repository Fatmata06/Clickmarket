const express = require("express");
const router = express.Router();
const {
  getFavoris,
  ajouterFavori,
  retirerFavori,
  verifierFavori,
} = require("../controllers/favoriController");
const { auth } = require("../middleware/auth");

// Toutes les routes nécessitent une authentification
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Favoris
 *   description: Gestion des favoris
 */

/**
 * @swagger
 * /api/favoris:
 *   get:
 *     summary: Récupérer tous les favoris de l'utilisateur
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris récupérée avec succès
 */
router.get("/", getFavoris);

/**
 * @swagger
 * /api/favoris/check/{produitId}:
 *   get:
 *     summary: Vérifier si un produit est favori
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/check/:produitId", verifierFavori);

/**
 * @swagger
 * /api/favoris/{produitId}:
 *   post:
 *     summary: Ajouter un produit aux favoris
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: string
 */
router.post("/:produitId", ajouterFavori);

/**
 * @swagger
 * /api/favoris/{produitId}:
 *   delete:
 *     summary: Retirer un produit des favoris
 *     tags: [Favoris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produitId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/:produitId", retirerFavori);

module.exports = router;
