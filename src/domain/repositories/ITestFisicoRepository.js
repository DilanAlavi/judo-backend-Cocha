class ITestFisicoRepository {
  async listarPorMesociclo(mesocicloId) { throw new Error('No implementado') }
  async listarPorJudoka(judokaId) { throw new Error('No implementado') }
  async obtener(id) { throw new Error('No implementado') }
  async obtenerPorJudokaMesociclo(judokaId, mesocicloId) { throw new Error('No implementado') }
  async crear(datos) { throw new Error('No implementado') }
  async actualizar(id, datos) { throw new Error('No implementado') }
}

module.exports = ITestFisicoRepository
