const express = require("express");
const router = express.Router();
const fournisseurController = require("../controllers/fournisseurController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Fournisseur:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - motDePasse
 *         - nomEntreprise
 *         - numeroEntreprise
 *         - localisationEntreprise
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du fournisseur
 *         nom:
 *           type: string
 *           description: Nom du fournisseur
 *           example: "Sarr"
 *         prenom:
 *           type: string
 *           description: Prénom du fournisseur
 *           example: "Moussa"
 *         email:
 *           type: string
 *           format: email
 *           description: Email du fournisseur
 *           example: "moussa.sarr@entreprise.sn"
 *         nomEntreprise:
 *           type: string
 *           description: Nom de l'entreprise
 *           example: "Ferme Bio Sarr"
 *         numeroEntreprise:
 *           type: string
 *           description: Numéro d'identification de l'entreprise
 *           example: "SN123456789"
 *         localisationEntreprise:
 *           type: string
 *           description: Localisation de l'entreprise
 *           example: "Thiès, Sénégal"
 *         estverifie:
 *           type: boolean
 *           default: false
 *           description: Statut de vérification du fournisseur
 *         produits:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des produits du fournisseur
 *         role:
 *           type: string
 *           enum: [fournisseur]
 *           default: fournisseur
 *         dateCreation:
 *           type: string
 *           format: date-time
 *
 *     FournisseurRegisterInput:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - motDePasse
 *         - nomEntreprise
 *         - numeroEntreprise
 *         - localisationEntreprise
 *       properties:
 *         nom:
 *           type: string
 *           example: "Sarr"
 *         prenom:
 *           type: string
 *           example: "Moussa"
 *         email:
 *           type: string
 *           format: email
 *           example: "moussa.sarr@entreprise.sn"
 *         motDePasse:
 *           type: string
 *           format: password
 *           example: "Password123!"
 *         nomEntreprise:
 *           type: string
 *           example: "Ferme Bio Sarr"
 *         numeroEntreprise:
 *           type: string
 *           example: "SN123456789"
 *         localisationEntreprise:
 *           type: string
 *           example: "Thiès, Sénégal"
 *
 *     FournisseurLoginInput:
 *       type: object
 *       required:
 *         - email
 *         - motDePasse
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "moussa.sarr@entreprise.sn"
 *         motDePasse:
 *           type: string
 *           format: password
 *           example: "Password123!"
 *
 *     FournisseurAuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Fournisseur créé"
 *         token:
 *           type: string
 *           description: Token JWT
 *         fournisseur:
 *           $ref: '#/components/schemas/Fournisseur'
 */

/**
 * @swagger
 * tags:
 *   name: Fournisseurs
 *   description: Gestion des fournisseurs
 */

/**
 * @swagger
 * /api/fournisseurs/register:
 *   post:
 *     summary: Enregistrer un nouveau fournisseur
 *     tags: [Fournisseurs]
 *     description: Crée un nouveau compte fournisseur avec toutes les informations de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FournisseurRegisterInput'
 *     responses:
 *       201:
 *         description: Fournisseur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FournisseurAuthResponse'
 *       400:
 *         description: Email déjà utilisé ou champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email déjà utilisé"
 *       500:
 *         description: Erreur serveur
 */
router.post("/register", fournisseurController.registerFournisseur);

/**
 * @swagger
 * /api/fournisseurs/login:
 *   post:
 *     summary: Connexion fournisseur
 *     tags: [Fournisseurs]
 *     description: Authentifie un fournisseur et retourne un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FournisseurLoginInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 token:
 *                   type: string
 *       400:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Fournisseur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", fournisseurController.loginFournisseur);

//router.get("/", fournisseurController.getAllFournisseurs);
//router.get("/:id", fournisseurController.getFournisseur);
//router.put("/:id", fournisseurController.updateFournisseur);
//router.delete("/:id", fournisseurController.deleteFournisseur);

module.exports = router;
