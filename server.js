//punto de entrada para la interacción entre las apis y la bd
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
//const commentRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
//app.use('/api/comments', commentRoutes);

// Health
app.get('/', (req, res) => res.send('API Cientify funcionando'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
