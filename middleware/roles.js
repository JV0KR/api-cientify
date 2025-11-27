// middleware/roles.js
// Middleware de roles mejorado para proteger endpoints

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  const userRole = req.user.rol;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ 
      message: 'No tienes permiso para realizar esta acción',
      requiredRoles: allowedRoles,
      userRole: userRole
    });
  }
  next();
};

const requireOwnerOrAdmin = (getOwnerId) => async (req, res, next) => {
  try {
    const ownerId = await getOwnerId(req);
    const userId = req.user._id;
    const isAdmin = req.user.rol === 'admin';
    
    if (!isAdmin && ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este recurso' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error en validación de permisos' });
  }
};

module.exports = { requireRole, requireOwnerOrAdmin };
