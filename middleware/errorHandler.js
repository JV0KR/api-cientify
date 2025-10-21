//si ocurre un error avisa de que hubo un error
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error del servidor'
  });
};

module.exports = errorHandler;
