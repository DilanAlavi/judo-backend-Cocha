const { verificarToken } = require('../../../shared/utils/jwt')
const AppError = require('../../../shared/errors/AppError')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token no proporcionado', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verificarToken(token)
    req.usuario = decoded
    next()
  } catch (error) {
    next(new AppError('Token inválido o expirado', 401))
  }
}

module.exports = authMiddleware