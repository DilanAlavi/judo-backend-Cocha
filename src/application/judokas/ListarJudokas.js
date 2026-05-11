const AppError = require('../../shared/errors/AppError')

class ListarJudokas {
  constructor(judokaRepository) {
    this.judokaRepository = judokaRepository
  }

  async ejecutar(usuarioRol, clubId = null) {
    if (usuarioRol === 'sensei') {
      return await this.judokaRepository.listarPorClub(clubId)  // solo su club
    }
    return await this.judokaRepository.listarTodos()             // admin/asociacion: todos
  }
}

module.exports = ListarJudokas