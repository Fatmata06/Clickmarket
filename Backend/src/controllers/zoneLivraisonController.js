const ZoneLivraison = require("../models/ZoneLivraison");

exports.creerZone = async (req, res) => {
  try {
    const { nom, prix, description, estActive } = req.body;

    if (!nom || prix === undefined) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Vérifier l'existence d'une zone avec le même nom
    const zoneExistante = await ZoneLivraison.findOne({ nom });
    if (zoneExistante) {
      return res.status(400).json({ message: "Une zone avec ce nom existe déjà" });
    }

    // Générer automatiquement le code au format Zone_X
    const countZones = await ZoneLivraison.countDocuments();
    const nouveauCode = `Zone_${countZones + 1}`;

    const zone = await ZoneLivraison.create({
      nom,
      code: nouveauCode,
      prix,
      description,
      estActive: estActive !== undefined ? estActive : true,
    });

    res.status(201).json({ message: "Zone creee", zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listerZones = async (req, res) => {
  try {
    const filtre = {};
    if (req.query.active === "true") filtre.estActive = true;
    if (req.query.active === "false") filtre.estActive = false;

    const zones = await ZoneLivraison.find(filtre).sort({ nom: 1 });
    res.json({ message: "Zones récupérées avec succès", zones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recupererZone = async (req, res) => {
  try {
    const zone = await ZoneLivraison.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: "Zone introuvable" });
    }
    res.json({ message: "Zone récupérée avec succès", zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.mettreAJourZone = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Empêcher la modification du code (généré automatiquement)
    delete updates.code;

    const zone = await ZoneLivraison.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!zone) {
      return res.status(404).json({ message: "Zone introuvable" });
    }

    res.json({ message: "Zone mise a jour", zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.supprimerZone = async (req, res) => {
  try {
    const zone = await ZoneLivraison.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: "Zone introuvable" });
    }
    res.json({ message: "Zone supprimee" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};