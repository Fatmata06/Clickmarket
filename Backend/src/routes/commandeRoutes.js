const express = require("express");
const router = express.Router();
const {
  creerCommande,
  listerCommandes,
  recupererCommande,
  mettreAJourStatut,
  annulerCommande,
  modifierAdresseLivraison,
  ajouterCommentaire,
  getCommentaires,
  getHistorique,
  mettreAJourPaiement,
} = require("../controllers/commandeController");
const { auth, isRole } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - produit
 *         - quantite
 *       properties:
 *         produit:
 *           type: string
 *           description: ID du produit
 *           example: "507f1f77bcf86cd799439011"
 *         nomProduit:
 *           type: string
 *           description: Nom du produit (généré automatiquement)
 *         quantite:
 *           type: number
 *           minimum: 1
 *           description: Quantité commandée
 *           example: 3
 *         prixUnitaire:
 *           type: number
 *           description: Prix unitaire (récupéré automatiquement)
 *         total:
 *           type: number
 *           description: Total de la ligne (calculé automatiquement)
 *
 *     Commande:
 *       type: object
 *       required:
 *         - utilisateur
 *         - articles
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la commande
 *         utilisateur:
 *           type: string
 *           description: ID de l'utilisateur
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         montantTotal:
 *           type: number
 *           description: Montant total de la commande (calculé automatiquement)
 *         fraisLivraison:
 *           type: number
 *           description: Frais de livraison (récupérés de la zone)
 *         statutCommande:
 *           type: string
 *           enum: [en_attente, confirmee, en_cours, expediee, livree, annulee]
 *           default: en_attente
 *         adresseLivraison:
 *           type: string
 *           description: Adresse de livraison
 *           example: "12 Rue de la Paix, Dakar"
 *         aLivrer:
 *           type: boolean
 *           default: true
 *           description: Indique si la commande nécessite une livraison
 *         zoneLivraison:
 *           type: string
 *           description: ID de la zone de livraison
 *         dateCommande:
 *           type: string
 *           format: date-time
 *         dateLivraison:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CommandeInput:
 *       type: object
 *       properties:
 *         adresseLivraison:
 *           type: string
 *           description: Adresse de livraison (requise si aLivrer est true)
 *           example: "12 Rue de la Paix, Dakar"
 *         zoneLivraison:
 *           type: string
 *           description: ID de la zone de livraison (requise si aLivrer est true)
 *           example: "507f1f77bcf86cd799439022"
 *         aLivrer:
 *           type: boolean
 *           default: true
 *           description: Indique si une livraison est nécessaire
 *         dateLivraison:
 *           type: string
 *           format: date-time
 *           description: Date souhaitée de livraison
 */

/**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Gestion des commandes
 */

/**
 * @swagger
 * /api/commandes:
 *   post:
 *     summary: Créer une nouvelle commande à partir du panier
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Crée une nouvelle commande en utilisant les articles du panier de l'utilisateur.
 *
 *       **Workflow :**
 *       1. Récupère le panier de l'utilisateur authentifié
 *       2. Valide que le panier contient au moins un article
 *       3. Crée une copie (snapshot) des articles avec leurs prix actuels
 *       4. Calcule les frais de livraison selon la zone sélectionnée
 *       5. Calcule le montant total (articles + frais)
 *       6. Crée la commande en base de données
 *       7. **LE PANIER RESTE INTACT** → l'utilisateur peut continuer à ajouter/supprimer des produits
 *
 *       **Important :** Le panier n'est pas vidé. L'utilisateur peut :
 *       - Ajouter/modifier/supprimer des articles après la commande
 *       - Créer plusieurs commandes avec les mêmes articles
 *       - Vider manuellement le panier avec DELETE /api/panier/vider s'il le souhaite
 *
 *       **Authentification :** Requise (Bearer token JWT)
 *
 *       **Snapshot Pattern :** Les articles de la commande sont gelés à leur prix au moment de la création.
 *       Si les prix changent dans le catalogue, la commande garde les prix d'origine.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommandeInput'
 *     responses:
 *       201:
 *         description: Commande créée avec succès. Le panier est conservé pour permettre d'autres commandes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Commande creee avec succes"
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *                 info:
 *                   type: string
 *                   example: "Le panier n'a pas été vidé. Vous pouvez continuer à ajouter ou supprimer des produits."
 *       400:
 *         description: Panier vide ou données invalides (adresse/zone manquantes si livraison demandée)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Votre panier est vide. Veuillez ajouter des articles avant de commander."
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Panier, produit ou zone introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Panier introuvable. Veuillez d'abord ajouter des articles."
 *       500:
 *         description: Erreur serveur
 */
router.post("/", auth, creerCommande);

/**
 * @swagger
 * /api/commandes:
 *   get:
 *     summary: Lister les commandes
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Liste les commandes de l'utilisateur connecté. Les admins voient toutes les commandes.
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [en_attente, confirmee, en_cours, expediee, livree, annulee]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commandes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Commande'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get("/", auth, listerCommandes);

/**
 * @swagger
 * /api/commandes/{id}:
 *   get:
 *     summary: Récupérer une commande par son ID
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Récupère les détails d'une commande spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", auth, recupererCommande);

/**
 * @swagger
 * /api/commandes/{id}/statut:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Met à jour le statut d'une commande. Réservé aux admins et fournisseurs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [en_attente, confirmee, en_cours, expediee, livree, annulee]
 *                 example: "confirmee"
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut mis a jour"
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
  "/:id/statut",
  auth,
  isRole(["admin", "fournisseur"]),
  mettreAJourStatut,
);

/**
 * @swagger
 * /api/commandes/{id}/annuler:
 *   patch:
 *     summary: Annuler une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Annule une commande si elle n'est pas déjà livrée ou annulée. Le propriétaire ou un admin peut annuler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande annulée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Commande annulee"
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Commande déjà finalisée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/annuler", auth, annulerCommande);

/**
 * @swagger
 * /api/commandes/{id}/adresse:
 *   patch:
 *     summary: Modifier l'adresse de livraison
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Modifie l'adresse de livraison d'une commande. Seul le propriétaire ou un admin peut modifier. La commande ne doit pas être livrée ou annulée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adresseLivraison
 *             properties:
 *               adresseLivraison:
 *                 type: string
 *                 maxlength: 300
 *                 example: "123 Rue Nouvelle, Dakar, Sénégal"
 *     responses:
 *       200:
 *         description: Adresse modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Adresse vide ou commande finalisée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/adresse", auth, modifierAdresseLivraison);

/**
 * @swagger
 * /api/commandes/{id}/commentaires:
 *   post:
 *     summary: Ajouter un commentaire à la commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Ajoute un commentaire à une commande (ex. "Sonner avant d'entrer"). Limité à 500 caractères.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texte
 *             properties:
 *               texte:
 *                 type: string
 *                 maxlength: 500
 *                 example: "Sonner avant d'entrer, je suis au 3ème étage"
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Commentaire vide ou trop long
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/commentaires", auth, ajouterCommentaire);

/**
 * @swagger
 * /api/commandes/{id}/commentaires:
 *   get:
 *     summary: Récupérer les commentaires d'une commande
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Récupère tous les commentaires associés à une commande
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentaires:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       auteur:
 *                         type: object
 *                       texte:
 *                         type: string
 *                       dateCreation:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/commentaires", auth, getCommentaires);

/**
 * @swagger
 * /api/commandes/{id}/historique:
 *   get:
 *     summary: Récupérer l'historique des modifications
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Récupère l'historique complet de toutes les modifications apportées à la commande (adresse, statut, paiement, etc.)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 historique:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       champ:
 *                         type: string
 *                         description: Nom du champ modifié
 *                         example: "adresseLivraison"
 *                       ancienneValeur:
 *                         type: string
 *                         description: Valeur avant modification
 *                       nouvelleValeur:
 *                         type: string
 *                         description: Valeur après modification
 *                       modifiePar:
 *                         type: object
 *                         description: Utilisateur qui a effectué la modification
 *                       dateModification:
 *                         type: string
 *                         format: date-time
 *                       raison:
 *                         type: string
 *                         description: Raison de la modification
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id/historique", auth, getHistorique);

/**
 * @swagger
 * /api/commandes/{id}/paiement:
 *   patch:
 *     summary: Mettre à jour le statut de paiement
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     description: Modifie le statut et les détails du paiement. Réservé aux admins et fournisseurs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [en_attente, en_cours, reussi, echoue, rembourse, annule]
 *                 example: "reussi"
 *               montantPaye:
 *                 type: number
 *                 minimum: 0
 *                 example: 15000
 *               methodePaiement:
 *                 type: string
 *                 example: "carte_bancaire"
 *               referenceTransaction:
 *                 type: string
 *                 example: "TXN123456789"
 *     responses:
 *       200:
 *         description: Statut de paiement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 commande:
 *                   $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (réservé aux admins)
 *       404:
 *         description: Commande introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch(
  "/:id/paiement",
  auth,
  isRole(["admin", "fournisseur"]),
  mettreAJourPaiement,
);

module.exports = router;
