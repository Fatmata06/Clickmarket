const Fournisseur = require('../models/Fournisseur');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login fournisseur
exports.loginFournisseur = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const fournisseur = await Fournisseur.findOne({ email });
    if (!fournisseur) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, fournisseur.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer token JWT
    const token = jwt.sign(
      { id: fournisseur._id, role: fournisseur.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      fournisseur,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
