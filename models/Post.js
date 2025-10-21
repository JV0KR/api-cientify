//el cuerpo que tienen las publicaciones / post 
// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  summary: { type: String },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, {
  timestamps: true // createdAt y updatedAt automáticos
});

// Asegurar updatedAt también en findOneAndUpdate / findByIdAndUpdate, esto es como un middleware
PostSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (!update) return next();
  const now = new Date();
  if (update.$set) {
    update.$set.updatedAt = now;
  } else {
    update.updatedAt = now;
  }
  this.setUpdate(update);
  next();
});

module.exports = mongoose.model('Post', PostSchema);
