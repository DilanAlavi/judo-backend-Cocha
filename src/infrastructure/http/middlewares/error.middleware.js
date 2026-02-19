const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Error interno del servidor'
  
    res.status(statusCode).json({
      ok: false,
      status: err.status || 'error',
      message
    })
  }
  
  module.exports = errorMiddleware