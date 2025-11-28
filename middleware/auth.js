const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// ✅ Middleware opcional: intenta autenticar pero no falla si no hay token
const authOptional = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (err) {
    // Ignorar errores de autenticación y continuar como anónimo
    next();
  }
};

const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado' });
  if (!roles.includes(req.user.rol)) return res.status(403).json({ message: 'Permiso denegado' });
  next();
};


module.exports = { auth, authOptional, permit };

