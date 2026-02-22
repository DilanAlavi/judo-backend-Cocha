const AppError = require('../../shared/errors/AppError')

class GuardarNota {
  constructor(repo) {
    this.repo = repo
  }

  async ejecutar(microcicloEjercicioId, judokaId, nota, comentarioSensei, estadoMicrociclo) {
    if (estadoMicrociclo !== 'Pendiente') {
      throw new AppError('No se pueden modificar notas de un microciclo Completado o Cancelado', 400)
    }
    if (nota !== null && nota !== undefined && (nota < 1 || nota > 10)) {
      throw new AppError('La nota debe estar entre 1 y 10', 400)
    }
    return await this.repo.guardarNota(microcicloEjercicioId, judokaId, nota, comentarioSensei)
  }
}

module.exports = GuardarNota