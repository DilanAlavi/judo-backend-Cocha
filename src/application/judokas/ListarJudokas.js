const AppError = require('../../shared/errors/AppError')

class ListarJudokas {
  constructor(judokaRepository) {
    this.judokaRepository = judokaRepository
  }

  async ejecutar(usuarioRol) {
    if (!['admin', 'asociacion'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso', 403)
    }
    return await this.judokaRepository.listarTodos()
  }
}

module.exports = ListarJudokas