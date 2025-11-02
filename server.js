
// punto de entrada para la interacción entre las APIs y la BD
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Rutas principales
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();

// =============================
//   Middleware global
// =============================
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// =============================
//   Conexión a la base de datos
// =============================
connectDB(process.env.MONGO_URI);

// =============================
//   Servir archivos subidos
//   Esto permite acceder a /uploads/<archivo>
// =============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============================
//   Rutas principales
// =============================
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// =============================
//   Ruta base de prueba (Health Check)
// =============================
app.get('/', (req, res) => res.send('🚀 API Cientify funcionando correctamente'));

// =============================
//   Manejador global de errores
// =============================
app.use(errorHandler);

// =============================
//   Inicialización del servidor
// =============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('✅ Servidor corriendo en puerto ${PORT}'));