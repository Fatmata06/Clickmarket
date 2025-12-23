const Fournisseur = require("../models/Fournisseur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerFournisseur = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    const exist = await Fournisseur.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);

    const fournisseur = await Fournisseur.create({
      nom,
      email,
      password: hashed,
    });

    res.status(201).json({ message: "Fournisseur créé", fournisseur });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.loginFournisseur = async (req, res) => {
  try {
    const { email, password } = req.body;

    const fournisseur = await Fournisseur.findOne({ email });
    if (!fournisseur)
      return res.status(404).json({ message: "Fournisseur non trouvé" });

    const isMatch = await bcrypt.compare(password, fournisseur.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: fournisseur._id, role: "fournisseur" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
