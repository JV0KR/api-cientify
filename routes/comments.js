//rutas de los comentarios - para desarrolarlo es similar al de users
// routes/comments.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth'); // si usas autenticación

// =============================
//   Crear un comentario
// =============================
router.post('/create', protect, commentController.create);

// =============================
//   Listar comentarios
//   (opcionalmente filtrar por ?post=id o ?author=id)
// =============================
router.get('/list', commentController.list);

// =============================
//   Obtener un comentario específico
// =============================
router.get('/get/:id', commentController.get);

// =============================
//   Actualizar un comentario
// =============================
router.put('/update/:id', protect, commentController.update);

// =============================
//   Eliminar un comentario
// =============================
router.delete('/delete/:id', protect, commentController.remove);

// =============================
//   Dar o quitar like
// =============================
router.put('/like/:id', protect, commentController.toggleLike);

module.exports = router;
