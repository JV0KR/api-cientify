// routes/posts.js
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postController');
const { auth } = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 

// ===============================================
//   Rutas de publicaciones (posts)
// ===============================================

// Crear post con archivo (imagen, PDF, etc.)
router.post('/', auth, upload.single('file'), postCtrl.create);

// Listar posts (paginación y filtros)
router.get('/list', postCtrl.list);

// Obtener un post por id (usa query param: ?id=)
router.get('/findPost/:id', postCtrl.get);

//  Actualizar post (por id)
router.put('/update/:id', auth, upload.single('file'), postCtrl.update);

// Eliminar post (por id)
router.delete('/remove/:id', auth, postCtrl.remove);

// Agregar o quitar "like" a un post
router.post('/:id/like', auth, postCtrl.toggleLike);

// Guardar o quitar guardado de un post
router.post('/:id/save', auth, postCtrl.toggleSave);

module.exports = router;
