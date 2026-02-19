const AppError = require('../../../shared/errors/AppError')

const rolesMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('No autenticado', 401))
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(new AppError('No tienes permiso para esta acción', 403))
    }

    next()
  }
}

module.exports = rolesMiddleware