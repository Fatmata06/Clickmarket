const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/User");

exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // req.user = decoded; // Ajoute l'utilisateur décodé à la requête

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      nom: decoded.nom,
      prenom: decoded.prenom
    };
    next();  // Passe au middleware suivant
  } catch (err) {
    res.status(400).json({ message: 'Token invalide.' });
  }
};

exports.isRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé. Rôle non autorisé." });
    }
    next(); // L'utilisateur a le bon rôle, on continue la route
  };
};
