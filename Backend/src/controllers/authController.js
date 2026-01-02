const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ---------------- INSCRIPTION ----------------
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role } = req.body;

    // console.log("BODY RECU:", req.body);

    if (!motDePasse) {
      return res.status(400).json({ message: "Le mot de passe est requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedMotDePasse = await bcrypt.hash(motDePasse, 10);

    const user = new User({
      nom,
      prenom,
      email,
      motDePasse: hashedMotDePasse,
      role: "client",
      dateCreation: new Date(),
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, prenom: user.prenom },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Erreur register:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // console.log("LOGIN BODY RECU:", req.body);

    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.bloque) {
      return res.status(403).json({ message: "Votre compte a été bloqué. Contactez l'administrateur." });
    }

    // console.log("USER TROUVE:", user);

    const isValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isValid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, nom: user.nom, prenom: user.prenom },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- GET ALL USERS ----------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-motDePasse");
    res.status(200).json({ message: "Liste des utilisateurs récupérée avec succès", users });
  } catch (err) {
    console.error("Erreur getAllUsers:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- GET USER BY ID ----------------
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID utilisateur invalide" });

    const user = await User.findById(id).select("-motDePasse");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur getUser:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- GET CURRENT USER ----------------
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-motDePasse");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Utilisateur connecté récupéré avec succès", user });
  } catch (err) {
    console.error("Erreur getCurrentUser:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- UPDATE USER PROFILE ----------------
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID utilisateur invalide" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.bloque) return res.status(403).json({ message: "Compte bloqué" });

    // Vérifier si le nouvel email est déjà utilisé
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Mise à jour mot de passe si demandé
    if (req.body.motDePasse?.trim() && req.body.newMotDePasse?.trim()) {
      if (req.body.motDePasse === req.body.newMotDePasse)
        return res.status(400).json({ message: "Les mots de passe sont identiques" });

      const isValid = await bcrypt.compare(req.body.motDePasse, user.motDePasse);
      if (!isValid) return res.status(400).json({ message: "Mot de passe actuel incorrect" });

      const hashed = await bcrypt.hash(req.body.newMotDePasse, 10);
      updateData.motDePasse = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-motDePasse");

    res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
  } catch (err) {
    console.error("Erreur updateUserProfile:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newMotDePasse } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    user.motDePasse = await bcrypt.hash(newMotDePasse, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur resetPassword:", err);
    if (err.name === "TokenExpiredError") {
      res.status(400).json({ message: "Le lien a expiré" });
    } else if (err.name === "JsonWebTokenError") {
      res.status(400).json({ message: "Token invalide" });
    } else {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
};
