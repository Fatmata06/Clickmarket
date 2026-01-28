const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth, isRole } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - motDePasse
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de l'utilisateur
 *         nom:
 *           type: string
 *           description: Nom de l'utilisateur
 *           example: "Diop"
 *         prenom:
 *           type: string
 *           description: Prénom de l'utilisateur
 *           example: "Amadou"
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *           example: "amadou.diop@example.com"
 *         emailVerifie:
 *           type: boolean
 *           default: false
 *           description: Statut de vérification de l'email
 *         telephone:
 *           type: string
 *           description: Numéro de téléphone
 *           example: "+221 77 123 45 67"
 *         adresse:
 *           type: string
 *           description: Adresse de l'utilisateur
 *         role:
 *           type: string
 *           enum: [admin, fournisseur, client]
 *           default: client
 *           description: Rôle de l'utilisateur
 *         dateCreation:
 *           type: string
 *           format: date-time
 *           description: Date de création du compte
 *         dateModification:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - motDePasse
 *       properties:
 *         nom:
 *           type: string
 *           example: "Diop"
 *         prenom:
 *           type: string
 *           example: "Amadou"
 *         email:
 *           type: string
 *           format: email
 *           example: "amadou.diop@example.com"
 *         motDePasse:
 *           type: string
 *           format: password
 *           example: "Password123!"
 *         telephone:
 *           type: string
 *           example: "+221 77 123 45 67"
 *         adresse:
 *           type: string
 *           example: "Dakar, Sénégal"
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - motDePasse
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "amadou.diop@example.com"
 *         motDePasse:
 *           type: string
 *           format: password
 *           example: "Password123!"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Connexion réussie"
 *         token:
 *           type: string
 *           description: Token JWT
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 */

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Authentification]
 *     description: Crée un nouveau compte utilisateur avec le rôle "client" par défaut
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email déjà utilisé ou validation échouée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cet email est déjà utilisé."
 *       500:
 *         description: Erreur serveur
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email ou mot de passe manquant
 *       401:
 *         description: Mot de passe incorrect
 *       403:
 *         description: Compte bloqué
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/client-only:
 *   get:
 *     summary: Route protégée pour les clients
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     description: Route accessible uniquement aux utilisateurs avec le rôle CLIENT
 *     responses:
 *       200:
 *         description: Accès autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bienvenue client"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
// Protected
router.get("/client-only", auth, isRole("CLIENT"), (req, res) => {
  res.json({ message: "Bienvenue client" });
});

/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Route protégée pour les administrateurs
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     description: Route accessible uniquement aux utilisateurs avec le rôle ADMIN
 *     responses:
 *       200:
 *         description: Accès autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bienvenue admin"
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.get("/admin-only", auth, isRole("ADMIN"), (req, res) => {
  res.json({ message: "Bienvenue admin" });
});

module.exports = router;
