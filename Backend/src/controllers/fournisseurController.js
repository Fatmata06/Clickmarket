const Fournisseur = require("../models/Fournisseur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerFournisseur = async (req, res) => {
  console.log("BODY RECU =====>", req.body);

  try {
    // Déstructuration complète
    const { nom, prenom, email, motDePasse, nomEntreprise, numeroEntreprise, localisationEntreprise } = req.body;

    // Vérifier si l'email existe
    const exist = await Fournisseur.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email déjà utilisé" });

    // Vérifier que tous les champs sont remplis
    if (!nom || !prenom || !email || !motDePasse || !nomEntreprise || !numeroEntreprise || !localisationEntreprise) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(motDePasse, 10);

    // Création du fournisseur
    const fournisseur = await Fournisseur.create({
      nom,
      prenom,
      email,
      motDePasse: hashed,
      nomEntreprise,
      numeroEntreprise,
      localisationEntreprise,
      role: "fournisseur"
    });

    // Générer token JWT
    const token = jwt.sign(
      { id: fournisseur._id, role: "fournisseur" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "Fournisseur créé", fournisseur, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.loginFournisseur = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const fournisseur = await Fournisseur.findOne({ email });
    if (!fournisseur)
      return res.status(404).json({ message: "Fournisseur non trouvé" });

    const isMatch = await bcrypt.compare(motDePasse, fournisseur.motDePasse);
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
