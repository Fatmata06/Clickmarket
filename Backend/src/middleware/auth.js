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
      _id: decoded.userId,
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      nom: decoded.nom,
      prenom: decoded.prenom,
    };
    next(); // Passe au middleware suivant
  } catch (err) {
    res.status(400).json({ message: "Token invalide." });
  }
};

// Middleware d'authentification optionnelle pour le panier
// Ne bloque pas si le token est absent, mais l'ajoute à req.user s'il existe
exports.optionalAuth = async (req, res, next) => {
  // Supporte "Bearer" ou "bearer" (insensible à la casse)
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log("Token reçu dans optionalAuth:", token);

  if (!token) {
    // Pas de token, continuer sans req.user (invité)
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.userId,
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      nom: decoded.nom,
      prenom: decoded.prenom,
    };
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    // Token invalide, continuer en mode invité
    req.user = null;
    next();
  }
};

exports.isRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Rôle non autorisé." });
    }
    next(); // L'utilisateur a le bon rôle, on continue la route
  };
};
