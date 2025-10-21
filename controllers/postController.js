//la lógica de las publicaciones
// controllers/postController.js
const Post = require('../models/Post');

/**
 * create - crear nuevo post
 * Si existe req.user se usa como author; si no, se requiere author en body.
 */
exports.create = async (req, res, next) => {
  try {
    const { title, content, subtitle, summary, tags, published, publishedAt } = req.body;

    if (!title || !content) return res.status(400).json({ message: 'Faltan datos: titulo y contenido son obligatorios' });

    const author = req.user ? req.user._id : req.body.author;
    if (!author) return res.status(400).json({ message: 'Falta autor (id) o debes estar autenticado' });

    const data = {
      title,
      content,
      subtitle,
      summary,
      tags,
      published: published || false,
      publishedAt: published ? (publishedAt || new Date()) : undefined,
      author
    };

    const post = await Post.create(data);
    await post.populate('author', 'nombre email rol avatarUrl');
    return res.status(201).json(post);
  } catch (err) {
    console.error('postController.create error:', err);
    return next(err);
  }
};

/**
 * list - listar posts con paginación y filtros simples
 * Query params: page, limit, tag, author, published
 */
exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, tag, author, published } = req.query;
    const q = {};
    if (tag) q.tags = tag;
    if (author) q.author = author;
    if (typeof published !== 'undefined') q.published = published === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const posts = await Post.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'nombre email rol avatarUrl');

    const total = await Post.countDocuments(q);

    return res.json({ total, page: Number(page), limit: Number(limit), posts });
  } catch (err) {
    console.error('postController.list error:', err);
    return next(err);
  }
};

/**
 * get - obtener un post por id
 */
exports.get = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'nombre email rol avatarUrl');
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    return res.json(post);
  } catch (err) {
    console.error('postController.get error:', err);
    return next(err);
  }
};

/**
 * update - actualizar post por id
 */
exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Si se publica ahora y no tiene fecha, asignarla
    if (typeof updates.published !== 'undefined' && updates.published && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    // Primer: buscar post para verificar permisos
    const postBefore = await Post.findById(req.params.id);
    if (!postBefore) return res.status(404).json({ message: 'Post no encontrado' });

    // Verificar: autor o admin
    // req.user viene de middleware auth y tiene rol y _id (sin password)
    if (!req.user._id.equals(postBefore.author) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar este post' });
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('author', 'nombre email rol avatarUrl');

    return res.json(post);
  } catch (err) {
    console.error('postController.update error:', err);
    return next(err);
  }
};

/**
 * remove - eliminar post por id
 */
exports.remove = async (req, res, next) => {
  try {
    const postBefore = await Post.findById(req.params.id);
    if (!postBefore) return res.status(404).json({ message: 'Post no encontrado' });

    if (!req.user._id.equals(postBefore.author) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Post eliminado' });
  } catch (err) {
    console.error('postController.remove error:', err);
    return next(err);
  }
};
