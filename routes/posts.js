// routes/posts.js
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Crear post con archivo (imagen, PDF, etc.)
router.post('/', auth, upload.single('file'), postCtrl.create);

// Listar, obtener, actualizar, eliminar, likes, guardados...
router.get('/list', postCtrl.list);
router.get('/findPost', postCtrl.get);
router.put('/update', auth, postCtrl.update);
router.delete('/remove', auth, postCtrl.remove);
router.post('/:id/like', auth, postCtrl.toggleLike);
router.post('/:id/save', auth, postCtrl.toggleSave);

module.exports = router;
