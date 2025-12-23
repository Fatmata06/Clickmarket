const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'fournisseur', 'client'], default: 'client' },
  telephone: { type: String },
  adresse: { type: String },
  image: {
    url: {
      type: String,
      required: false,
    }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
});



module.exports = mongoose.model('User', userSchema);