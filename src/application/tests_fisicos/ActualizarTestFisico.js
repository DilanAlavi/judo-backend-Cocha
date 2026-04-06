const { calcularTodosVO2 } = require('../../shared/utils/calculos')

class ActualizarTestFisico {
  constructor(repo) { this.repo = repo }

  async ejecutar(id, datos) {
    // Recalcular todos los VO2 automáticamente
    const datosConVO2 = calcularTodosVO2({ ...datos })
    return await this.repo.actualizar(id, datosConVO2)
  }
}
module.exports = ActualizarTestFisico
