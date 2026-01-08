const express = require("express");
const router = express.Router();
const {
  getPanier,
  ajouterArticle,
  modifierArticle,
  supprimerArticle,
  viderPanier,
  mergePanierAfterLogin,
} = require("../controllers/panierController");
const { auth } = require("../middleware/auth");


/**
 * @swagger
 * /api/panier:
 *   get:
 *     summary: Récupérer le panier actuel
 *     tags: [Panier]
 *     responses:
 *       200:
 *         description: Panier récupéré avec succès
 */
router.get("/", getPanier);

/**
 * @swagger
 * /api/panier/article:
 *   post:
 *     summary: Ajouter un article au panier
 *     tags: [Panier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produitId]
 *             properties:
 *               produitId:
 *                 type: string
 *               quantite:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Article ajouté avec succès
 */
router.post("/article", ajouterArticle);

/**
 * @swagger
 * /api/panier/article/{articleId}:
 *   put:
 *     summary: Modifier un article du panier (produit et/ou quantité)
 *     tags: [Panier]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article du panier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produitId:
 *                 type: string
 *               quantite:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Article ou produit non trouvé
 */
router.put("/article/:articleId", modifierArticle);

/**
 * @swagger
 * /api/panier/article/{articleId}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     tags:
 *       - Panier
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article introuvable
 */
router.delete("/article/:articleId", supprimerArticle);

/**
 * @swagger
 * /api/panier/vider:
 *   delete:
 *     summary: Vider complètement le panier
 *     tags:
 *       - Panier
 *     responses:
 *       200:
 *         description: Panier vidé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.delete("/vider", viderPanier);

/**
 * @swagger
 * /api/panier/merge:
 *   post:
 *     summary: Fusionner le panier invité avec le panier utilisateur après connexion
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paniers fusionnés avec succès
 *       400:
 *         description: Données insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.post("/merge", auth, mergePanierAfterLogin);

module.exports = router;