const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
//const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../config/cloudinary');

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    console.log(req.body);

    if (!password) {
      return res.status(400).json({ message: "Le mot de passe est requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({ nom, prenom, email, password: hashedPassword, role });
    await user.save();



    // Générer un token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        prenom: user.prenom,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message:
          "Données invalides: Erreur lors de la création de l'utilisateur",
        error: err.message,
      });
    }
    console.error("Erreur dans register :", err);
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier que email et password sont fournis
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est bloqué
    if (user.bloque) {
      return res.status(403).json({ 
        message: "Votre compte a été bloqué. Contactez l'administrateur." 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Renvoyer également les informations de l'utilisateur
    res.status(200).json({
      message: "Connexion reussi!",
      token,
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err); // Log l'erreur
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion.", error: err.message });
  }
};




// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs depuis la base de données
    const users = await User.find({}).select("-password");

    // Renvoyer la liste des utilisateurs
    res
      .status(200)
      .json({ message: "Liste des utilisateurs récupérée avec succès", users });
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs.",
      error: err.message,
    });
  }
};

// Récupérer un utilisateur par son ID
exports.getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const user = await User.findById(req.params.id).select("-password"); // Exclut le mot de passe

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error: err.message,
    });
  }
};

// Récupérer l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur connecté récupéré avec succès",
      user,
    });
  } catch (err) {
    console.error("Erreur dans getCurrentUser :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour le profil de l'utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Pour les champs texte
    const file = req.file; // Pour le fichier image

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est bloqué
    if (user.bloque) {
      return res.status(403).json({ 
        message: "Votre compte a été bloquet. Contactez l'administrateur." 
      });
    }

    // Vérifier si le nouvel email est identique au vieux email ou un autre email deja utilisé
    if(req.body.email !== user.email) {
      const emailExists = await findUserByEmail(req.body.email);
      if (emailExists) {
        return res.status(400).json({ message: "Cet email est deja utilisé" });
      }
    }

    if (req.body.password?.trim() && req.body.newPassword?.trim()) {
      // Vérifier si le mot de passe actuel est identique au nouveau
      if (req.body.password === req.body.newPassword) {
        return res.status(400).json({ message: "Mots de passe identiques" });
      }

      // Vérifier si le mot de passe actuel est correct
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Mot de passe actuel incorrect" });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      updateData.password = hashedPassword;
    }


    // Si un fichier image est envoyé
    if (file) {
      // Upload vers Cloudinary ou stockage local
      const imageUrl = await uploadToCloudinary(file.buffer, "Profiles");
      updateData.image = { url: imageUrl };
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(id, updateData, 
      { new: true, runValidators: true }).select('-password');

    res.status(200).json({ message: "Profil mis à jour", user: updatedUser });

  } catch (err) {
    console.error("Erreur updateUserProfile:", err);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour",
      error: err.message
    });
  }
};


// réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Vérifier si le token est toujours valide en base
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // 3. Mettre à jour le mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;  // Invalider le token
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log(user);

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      res.status(400).json({ message: "Le lien a expiré." });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ message: "Token invalide." });
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

// Mettre à jour la photo de profil de l'utilisateur
exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // récupéré après authentification 
    const file = req.file; // image envoyée depuis un formulaire (Multer doit être utilisé)

    if (!file) {
      return res.status(400).json({ message: 'Aucune image envoyée.' });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Si l'utilisateur a déjà une image, on supprime l'ancienne sur Cloudinary
    if (user.image && user.image.publicId) {
      await deleteFromCloudinary(user.image.publicId);
    }

    // Upload la nouvelle image
    const uploadedResponse = await uploadToCloudinary(req.file.buffer, 'profiles');

    // Extraire le publicId
    const newPublicId = getPublicIdFromUrl(uploadedResponse);

    // Mise à jour du modèle User
    user.image = {
      url: uploadedResponse,
      publicId: newPublicId,
    };

    await user.save();

    res.status(200).json({ message: 'Photo de profil mise à jour avec succès.', image: user.image });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil:', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
