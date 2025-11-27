// routes/posts.js
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const { auth, authOptional, permit } = require('../middleware/auth');
const { requireRole, requireOwnerOrAdmin } = require('../middleware/roles');
const upload = require('../middleware/upload');

// ===============================================
//   Rutas de publicaciones (posts)
// ===============================================

//  Crear post (admin, cientifico, investigador, profesor)
router.post('/', 
  auth, 
  requireRole('admin', 'cientifico', 'investigador', 'profesor'),
  upload.single('file'), 
  postCtrl.create
);

//  Listar posts (admin ve todos, otros ven publicados)
router.get('/list', authOptional, postCtrl.list);

//  Obtener un post por id
router.get('/findPost/:id', authOptional, postCtrl.get);

//  Actualizar post (autor o admin)
router.put('/update/:id', 
  auth, 
  requireOwnerOrAdmin(async (req) => {
    const Post = require('../models/Post');
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('Post no encontrado');
    return post.author;
  }),
  upload.single('file'), 
  postCtrl.update
);

//  Eliminar post (solo admin)
router.delete('/remove/:id', 
  auth, 
  permit('admin'), 
  postCtrl.remove
);

//  Toggle publish (ocultar/mostrar) - solo admin
router.put('/:id/publish', 
  auth, 
  permit('admin'), 
  postCtrl.togglePublish
);

// Agregar o quitar "like" a un post
router.post('/:id/like', auth, postCtrl.toggleLike);

// Guardar o quitar guardado de un post
router.post('/:id/save', auth, postCtrl.toggleSave);

module.exports = router;
