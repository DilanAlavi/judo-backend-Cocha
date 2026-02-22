const AppError = require('../../shared/errors/AppError')

class GuardarComentarioJudoka {
  constructor(repo) {
    this.repo = repo
  }

  async ejecutar(microcicloId, judokaId, comentario, estadoMicrociclo) {
    if (estadoMicrociclo !== 'Completado') {
      throw new AppError('Solo puedes comentar microciclos que ya han sido completados', 400)
    }
    return await this.repo.guardarComentarioJudoka(microcicloId, judokaId, comentario)
  }
}

module.exports = GuardarComentarioJudoka