const { calcularTodosVO2 } = require('../../shared/utils/calculos')

class CrearTestFisico {
  constructor(repo) { this.repo = repo }

  async ejecutar(datos) {
    // Calcular todos los VO2 automáticamente antes de guardar
    const datosConVO2 = calcularTodosVO2({ ...datos })
    return await this.repo.crear(datosConVO2)
  }
}
module.exports = CrearTestFisico
