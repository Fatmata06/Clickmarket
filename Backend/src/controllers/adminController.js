const User = require("../models/User");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Liste tous les utilisateurs
 *     description: Récupère la liste de tous les utilisateurs avec filtres de recherche et de rôle (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom, prénom ou email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, fournisseur, client]
 *         description: Filtrer par rôle
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'utilisateurs par page
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Construction du filtre
    const filter = {};

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: "i" } },
        { prenom: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "tous") {
      filter.role = role;
    }

    // Récupérer les utilisateurs avec pagination
    const users = await User.find(filter)
      .select("-password") // Exclure les mots de passe
      .sort({ dateInscription: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total pour la pagination
    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Récupère un utilisateur par ID
 *     description: Récupère les détails d'un utilisateur spécifique (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Supprime un utilisateur
 *     description: Supprime définitivement un utilisateur (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Empêcher la suppression de son propre compte
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Modifie le rôle d'un utilisateur
 *     description: Change le rôle d'un utilisateur (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, fournisseur, client]
 *     responses:
 *       200:
 *         description: Rôle modifié avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "fournisseur", "client"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Empêcher la modification de son propre rôle
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas modifier votre propre rôle" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "Rôle modifié avec succès",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la modification du rôle:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
