const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Options pour timestamps
const options = {
  timestamps: { createdAt: 'dateCreation', updatedAt: 'dateModification' }
};

// Schema User
const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerifie: { type: Boolean, default: false },
  telephone: { type: String },
  adresse: { type: String },
  role: { type: String, enum: ['admin', 'fournisseur', 'client'], default: 'client' }, // CodeList
  motDePasse: { type: String, required: true },
}, options);

// Hash du mot de passe avant sauvegarde
// userSchema.pre('save', async function() {
//   if (!this.isModified('motDePasse')) return;
//   this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
// });

module.exports = mongoose.model('User', userSchema);
