const AppError = require('../../shared/errors/AppError')

class ObtenerJudoka {
  constructor(judokaRepository) {
    this.judokaRepository = judokaRepository
  }

  async ejecutar(id) {
    const judoka = await this.judokaRepository.obtenerPorId(id)
    if (!judoka) throw new AppError('Judoka no encontrado', 404)
    return judoka
  }
}

module.exports = ObtenerJudoka