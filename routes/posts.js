//rutas de los post - para desarrolarlo es similar al de users
// routes/posts.js
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const { auth, permit } = require('../middleware/auth');

// Rutas públicas
router.get('/', postCtrl.list);
router.get('/:id', postCtrl.get);

// Rutas protegidas: solo usuarios autenticados pueden crear/editar/eliminar
router.post('/', auth, postCtrl.create);
router.put('/update', auth, postCtrl.update);
router.delete('/:id', auth, postCtrl.remove);

// Si quisieras que solo admins hagan acciones específicas:
//router.delete('/:id', auth, permit('admin'), postCtrl.remove);

// Rutas para el like y guardar un post
router.post('/:id/like', auth, postCtrl.toggleLike);
router.post('/:id/save', auth, postCtrl.toggleSave);

module.exports = router;
