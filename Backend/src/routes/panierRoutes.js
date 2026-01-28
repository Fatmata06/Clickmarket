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
const { auth, optionalAuth } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     ArticlePanier:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de l'article dans le panier
 *         produitId:
 *           type: string
 *           description: ID du produit
 *         nomProduit:
 *           type: string
 *           description: Nom du produit
 *         quantite:
 *           type: number
 *           minimum: 1
 *           description: Quantité du produit
 *         prixUnitaire:
 *           type: number
 *           description: Prix unitaire du produit
 *         total:
 *           type: number
 *           description: Total pour cet article (quantité × prix)
 *
 *     Panier:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID du panier
 *         utilisateur:
 *           type: string
 *           description: ID de l'utilisateur (si connecté)
 *         sessionId:
 *           type: string
 *           description: ID de session (pour les invités)
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArticlePanier'
 *         montantTotal:
 *           type: number
 *           description: Montant total du panier
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
 *   name: Panier
 *   description: Gestion du panier d'achat
 */

/**
 * @swagger
 * /api/panier:
 *   get:
 *     summary: Récupérer le panier actuel
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     description: |
 *       Récupère le panier de l'utilisateur connecté ou le panier de session pour les invités.
 *
 *       **Priorité d'identification :**
 *       1. Si utilisateur authentifié (token JWT) → utiliser le panier utilisateur
 *       2. Sinon, utiliser le sessionId (cookie `cartSessionId` ou header `x-session-id`)
 *
 *       **Panier Utilisateur (Authentifié) :**
 *       - Lié au profil de l'utilisateur
 *       - Persistant : reste même après déconnexion/reconnexion
 *       - Les articles restent après création de commande (permet de commander plusieurs fois)
 *       - Peut être partagé entre plusieurs appareils (avec le même compte)
 *
 *       **Panier Invité (Non Authentifié) :**
 *       - Basé sur sessionId (identifiant de navigateur)
 *       - Temporaire : peut être perdu à chaque fermeture de navigateur
 *       - Fusionné dans le panier utilisateur lors du login
 *
 *       **Authentification :** Optionnelle
 *       - Avec token JWT : récupère panier utilisateur
 *       - Sans token : utilise sessionId pour panier invité
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT pour authentification (optionnel)
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *           example: "session_abc123def456"
 *         description: ID de session pour les invités (optionnel, peut être en cookie cartSessionId)
 *     responses:
 *       200:
 *         description: Panier récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Panier récupéré avec succès"
 *                 panier:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     utilisateur:
 *                       type: string
 *                       description: "ID utilisateur (null pour invités)"
 *                       example: "507f1f77bcf86cd799439012"
 *                     sessionId:
 *                       type: string
 *                       description: "ID session (null pour utilisateurs connectés)"
 *                       example: "abc-123-def-456"
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           produit:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               nomProduit:
 *                                 type: string
 *                               prix:
 *                                 type: number
 *                           quantite:
 *                             type: number
 *                             example: 2
 *                           prixUnitaire:
 *                             type: number
 *                             example: 50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Erreur serveur
 */
router.get("/", optionalAuth, getPanier);

/**
 * @swagger
 * /api/panier/article:
 *   post:
 *     summary: Ajouter un article au panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     description: |
 *       Ajoute un produit au panier ou augmente la quantité s'il existe déjà.
 *
 *       **Comportement :**
 *       - Si produit existe dans panier → augmente la quantité
 *       - Si produit n'existe pas → l'ajoute au panier
 *
 *       **Authentification :** Optionnelle
 *       - Avec token JWT : ajoute au panier utilisateur
 *       - Sans token : utilise sessionId pour panier invité
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT pour authentification (optionnel)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produitId
 *             properties:
 *               produitId:
 *                 type: string
 *                 description: ID du produit à ajouter
 *                 example: "507f1f77bcf86cd799439011"
 *               quantite:
 *                 type: integer
 *                 default: 1
 *                 minimum: 1
 *                 description: Quantité à ajouter
 *                 example: 2
 *     responses:
 *       200:
 *         description: Article ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article ajouté avec succès"
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Données invalides ou stock insuffisant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stock insuffisant"
 *       404:
 *         description: Produit introuvable ou inactif
 *       500:
 *         description: Erreur serveur
 */
router.post("/article", optionalAuth, ajouterArticle);

/**
 * @swagger
 * /api/panier/article/{articleId}:
 *   put:
 *     summary: Modifier un article du panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     description: |
 *       Modifie la quantité ou le produit d'un article existant dans le panier.
 *
 *       **Authentification :** Optionnelle
 *       - Avec token JWT : modifie dans panier utilisateur
 *       - Sans token : utilise sessionId pour panier invité
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article dans le panier
 *         example: "507f191e810c19729de860ea"
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT pour authentification (optionnel)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produitId:
 *                 type: string
 *                 description: Nouvel ID de produit (optionnel)
 *                 example: "507f1f77bcf86cd799439012"
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nouvelle quantité (optionnel)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article modifié avec succès"
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Article ou produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put("/article/:articleId", optionalAuth, modifierArticle);

/**
 * @swagger
 * /api/panier/article/{articleId}:
 *   delete:
 *     summary: Supprimer un article du panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     description: |
 *       Retire un article spécifique du panier.
 *
 *       **Authentification :** Optionnelle
 *       - Avec token JWT : supprime du panier utilisateur
 *       - Sans token : utilise sessionId pour panier invité
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article à supprimer
 *         example: "507f191e810c19729de860ea"
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT pour authentification (optionnel)
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article supprimé avec succès"
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       404:
 *         description: Article introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/article/:articleId", optionalAuth, supprimerArticle);

/**
 * @swagger
 * /api/panier/vider:
 *   delete:
 *     summary: Vider complètement le panier
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     description: |
 *       Supprime tous les articles du panier en conservant le panier lui-même (vide).
 *
 *       **Authentification :** Optionnelle
 *       - Avec token JWT : vide le panier utilisateur
 *       - Sans token : utilise sessionId pour vider panier invité
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT pour authentification (optionnel)
 *     responses:
 *       200:
 *         description: Panier vidé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Panier vidé avec succès"
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *       500:
 *         description: Erreur serveur
 */
router.delete("/vider", optionalAuth, viderPanier);

/**
 * @swagger
 * /api/panier/merge:
 *   post:
 *     summary: Fusionner le panier invité avec le panier utilisateur
 *     tags: [Panier]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Fusionne le panier de session (invité) avec le panier de l'utilisateur après connexion.
 *
 *       **Workflow de fusion :**
 *       1. Récupère le panier invité via sessionId
 *       2. Récupère ou crée le panier utilisateur
 *       3. Fusionne les articles :
 *          - Si article existe déjà → augmente la quantité
 *          - Si article n'existe pas → l'ajoute
 *       4. Supprime le panier invité
 *       5. Retourne le panier fusionné + sessionId à nettoyer
 *
 *       **IMPORTANT - Frontend :**
 *       - Après login, appeler cet endpoint immédiatement
 *       - Utiliser la valeur `sessionIdToDelete` pour nettoyer le cookie `cartSessionId`
 *       - Utiliser le `panier` retourné pour mettre à jour l'état du panier
 *
 *       **Authentification :** Requise (JWT)
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT requis pour authentification
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID de la session invité (peut aussi être passé via cookie cartSessionId)
 *                 example: "session_abc123def456"
 *     responses:
 *       200:
 *         description: Paniers fusionnés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Paniers fusionnés avec succès"
 *                 panier:
 *                   $ref: '#/components/schemas/Panier'
 *                 sessionIdToDelete:
 *                   type: string
 *                   description: SessionId à supprimer des cookies du frontend
 *                   example: "session_abc123def456"
 *       400:
 *         description: Données insuffisantes (sessionId ou userId manquant)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Données insuffisantes pour fusionner le panier"
 *       401:
 *         description: Non authentifié - token JWT manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post("/merge", auth, mergePanierAfterLogin);

module.exports = router;
