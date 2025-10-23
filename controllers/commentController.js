//la lógica que tienen los cometnarios
// controllers/commentController.js
const Comment = require('../models/Comment');

/**
 * create - Crear un nuevo comentario
 * Requiere: content, post
 * Usa req.user como autor si existe
 */
exports.create = async (req, res, next) => {
  try {
    const { content, post } = req.body;

    if (!content || !post) {
      return res.status(400).json({ message: 'Faltan campos requeridos: content y post' });
    }

    const author = req.user ? req.user._id : req.body.author;
    if (!author) return res.status(400).json({ message: 'Falta autor (id) o debes estar autenticado' });

    const comment = await Comment.create({ content, author, post });
    await comment.populate('author', 'nombre email avatarUrl');

    return res.status(201).json(comment);
  } catch (err) {
    console.error('commentController.create error:', err);
    next(err);
  }
};

/**
 * list - Listar todos los comentarios (opcionalmente por post o autor)
 * Query params: post, author, page, limit
 */
exports.list = async (req, res, next) => {
  try {
    const { post, author, page = 1, limit = 20 } = req.query;
    const q = {};
    if (post) q.post = post;
    if (author) q.author = author;

    const skip = (Number(page) - 1) * Number(limit);

    const comments = await Comment.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'nombre email avatarUrl')
      .populate('post', 'title')
      .populate('respuestas');

    const total = await Comment.countDocuments(q);

    return res.json({ total, page: Number(page), limit: Number(limit), comments });
  } catch (err) {
    console.error('commentController.list error:', err);
    next(err);
  }
};

/**
 * get - Obtener un comentario por id
 */
exports.get = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'nombre email avatarUrl')
      .populate('post', 'title')
      .populate('respuestas');

    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    return res.json(comment);
  } catch (err) {
    console.error('commentController.get error:', err);
    next(err);
  }
};

/**
 * update - Actualizar comentario
 * Solo el autor o admin puede editarlo
 */
exports.update = async (req, res, next) => {
  try {
    const commentBefore = await Comment.findById(req.params.id);
    if (!commentBefore) return res.status(404).json({ message: 'Comentario no encontrado' });

    if (!req.user._id.equals(commentBefore.author) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar este comentario' });
    }

    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: { content } },
      { new: true, runValidators: true }
    ).populate('author', 'nombre email avatarUrl');

    return res.json(comment);
  } catch (err) {
    console.error('commentController.update error:', err);
    next(err);
  }
};

/**
 * remove - Eliminar comentario
 * Solo el autor o admin puede eliminarlo
 */
exports.remove = async (req, res, next) => {
  try {
    const commentBefore = await Comment.findById(req.params.id);
    if (!commentBefore) return res.status(404).json({ message: 'Comentario no encontrado' });

    if (!req.user._id.equals(commentBefore.author) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error('commentController.remove error:', err);
    next(err);
  }
};

/**
 * toggleLike - Agregar o quitar "me gusta" de un comentario
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    const userId = req.user._id;
    const index = comment.likes.findIndex(id => id.equals(userId));

    if (index === -1) {
      comment.likes.push(userId);
      await comment.save();
      return res.json({ message: 'Like agregado', totalLikes: comment.likes.length });
    } else {
      comment.likes.splice(index, 1);
      await comment.save();
      return res.json({ message: 'Like removido', totalLikes: comment.likes.length });
    }
  } catch (err) {
    console.error('commentController.toggleLike error:', err);
    next(err);
  }
};
