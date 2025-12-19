// models/Utilisateur.js - CLASSE PARENTE ABSTRAITE
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema({
  // ID est automatique (_id)
  prenom: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  
  emailVerifie: {
    type: Boolean,
    default: false
  },
  
  telephone: {
    type: String,
    trim: true
  },
  
  adresse: {
    type: String,
    trim: true
  },
  
  role: {
    type: String,
    enum: ['client', 'fournisseur', 'admin'],
    required: true
  },
  
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  
  dateCreation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  discriminatorKey: 'role' // Pour l'héritage
});

// === MÉTHODES DE LA CLASSE UTILISATEUR ===

// Méthode: connection()
utilisateurSchema.methods.connection = async function(motDePasse) {
  try {
    const isMatch = await bcrypt.compare(motDePasse, this.motDePasse);
    return isMatch;
  } catch (error) {
    throw new Error('Erreur lors de la vérification du mot de passe');
  }
};

// Méthode: reinitialiserMotDePasse()
utilisateurSchema.methods.reinitialiserMotDePasse = async function(nouveauMotDePasse) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(nouveauMotDePasse, salt);
    await this.save();
    return true;
  } catch (error) {
    throw new Error('Erreur lors de la réinitialisation du mot de passe');
  }
};

// Méthode: mettreAJoursProfil()
utilisateurSchema.methods.mettreAJoursProfil = async function(donnees) {
  try {
    const champsAutorises = ['prenom', 'nom', 'telephone', 'adresse'];
    champsAutorises.forEach(champ => {
      if (donnees[champ] !== undefined) {
        this[champ] = donnees[champ];
      }
    });
    
    await this.save();
    return this;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du profil');
  }
};

// Middleware pour hacher le mot de passe
utilisateurSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Modèle de base Utilisateur
const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;