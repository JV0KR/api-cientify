const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'cientifico', 'admin'], default: 'usuario' },
  bio: { type: String },
  avatarUrl: { type: String },
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  siguiendo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
