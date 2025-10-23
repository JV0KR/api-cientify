//el cuerpo que tienen los comentarios
// models/Comment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true, trim: true }, // texto del comentario
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // usuario que comenta
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // publicación comentada
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // usuarios que dieron "me gusta"
  respuestas: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // respuestas al comentario
  isEdited: { type: Boolean, default: false } // si fue editado
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

// Middleware: marca como editado si cambia el contenido
CommentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (!update) return next();
  const now = new Date();
  
  // Si el contenido fue modificado, marcar como editado
  if (update.content || update.$set?.content) {
    if (!update.$set) update.$set = {};
    update.$set.isEdited = true;
  }

  // Mantener updatedAt actualizado
  if (update.$set) {
    update.$set.updatedAt = now;
  } else {
    update.updatedAt = now;
  }

  this.setUpdate(update);
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
