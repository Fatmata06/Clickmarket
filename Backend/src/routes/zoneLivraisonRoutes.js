const express = require("express");
const router = express.Router();
const {
  creerZone,
  listerZones,
  recupererZone,
  mettreAJourZone,
  supprimerZone,
} = require("../controllers/zoneLivraisonController");
const { auth, isRole } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     ZoneLivraison:
 *       type: object
 *       required:
 *         - nom
 *         - prix
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la zone
 *         nom:
 *           type: string
 *           description: Nom de la zone de livraison
 *           example: "Thies Est"
 *         code:
 *           type: string
 *           description: Code auto-généré de la zone (format Zone_X)
 *           example: "Zone_1"
 *         prix:
 *           type: number
 *           minimum: 0
 *           description: Prix de livraison pour cette zone
 *           example: 500
 *         description:
 *           type: string
 *           description: Description de la zone
 *           example: "Livraison entre Parcelles Assainies et Keur Massar"
 *         estActive:
 *           type: boolean
 *           default: true
 *           description: Statut d'activation de la zone
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *
 *     ZoneLivraisonInput:
 *       type: object
 *       required:
 *         - nom
 *         - prix
 *       properties:
 *         nom:
 *           type: string
 *           description: Nom de la zone de livraison
 *           example: "Thies Est"
 *         prix:
 *           type: number
 *           minimum: 0
 *           description: Prix de livraison pour cette zone
 *           example: 500
 *         description:
 *           type: string
 *           description: Description de la zone
 *           example: "Livraison entre Parcelles Assainies et Keur Massar"
 *         estActive:
 *           type: boolean
 *           default: true
 *           description: Statut d'activation de la zone
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Token d'authentification manquant ou invalide
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Token non fourni"
 *     ForbiddenError:
 *       description: Accès refusé - Droits administrateur requis
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Accès refusé"
 */

/**
 * @swagger
 * tags:
 *   name: Zones de Livraison
 *   description: Gestion des zones de livraison
 */

/**
 * @swagger
 * /api/zones-livraison:
 *   post:
 *     summary: Créer une nouvelle zone de livraison
 *     tags: [Zones de Livraison]
 *     security:
 *       - bearerAuth: []
 *     description: Crée une nouvelle zone de livraison. Le code est généré automatiquement au format Zone_X (Zone_1, Zone_2, etc.). Le nom de la zone doit être unique. Réservé aux administrateurs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ZoneLivraisonInput'
 *     responses:
 *       201:
 *         description: Zone créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone creee"
 *                 zone:
 *                   $ref: '#/components/schemas/ZoneLivraison'
 *       400:
 *         description: Champs requis manquants ou nom de zone déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Une zone avec ce nom existe déjà"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Erreur serveur
 */
router.post("/", auth, isRole(["admin"]), creerZone);

/**
 * @swagger
 * /api/zones-livraison:
 *   get:
 *     summary: Lister toutes les zones de livraison
 *     tags: [Zones de Livraison]
 *     description: Récupère la liste de toutes les zones de livraison triées par nom, avec possibilité de filtrer par statut actif ou inactif
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut actif (true) ou inactif (false)
 *     responses:
 *       200:
 *         description: Liste des zones récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zones récupérées avec succès"
 *                 zones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ZoneLivraison'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", listerZones);

/**
 * @swagger
 * /api/zones-livraison/{id}:
 *   get:
 *     summary: Récupérer une zone de livraison par son ID
 *     tags: [Zones de Livraison]
 *     description: Récupère les détails d'une zone de livraison spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zone de livraison
 *     responses:
 *       200:
 *         description: Zone récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zone:
 *                   $ref: '#/components/schemas/ZoneLivraison'
 *       404:
 *         description: Zone introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone introuvable"
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", recupererZone);

/**
 * @swagger
 * /api/zones-livraison/{id}:
 *   put:
 *     summary: Mettre à jour une zone de livraison
 *     tags: [Zones de Livraison]
 *     security:
 *       - bearerAuth: []
 *     description: Met à jour les informations d'une zone de livraison. Le code ne peut pas être modifié car il est généré automatiquement. Réservé aux administrateurs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zone de livraison
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Thies Ouest"
 *               prix:
 *                 type: number
 *                 example: 600
 *               description:
 *                 type: string
 *                 example: "Zone mise à jour"
 *               estActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Zone mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone mise a jour"
 *                 zone:
 *                   $ref: '#/components/schemas/ZoneLivraison'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Zone introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone introuvable"
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", auth, isRole(["admin"]), mettreAJourZone);

/**
 * @swagger
 * /api/zones-livraison/{id}:
 *   delete:
 *     summary: Supprimer une zone de livraison
 *     tags: [Zones de Livraison]
 *     security:
 *       - bearerAuth: []
 *     description: Supprime une zone de livraison définitivement. Réservé aux administrateurs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la zone de livraison
 *     responses:
 *       200:
 *         description: Zone supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone supprimée"
 *                 zone:
 *                   $ref: '#/components/schemas/ZoneLivraison'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Zone introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Zone introuvable"
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", auth, isRole(["admin"]), supprimerZone);

module.exports = router;
