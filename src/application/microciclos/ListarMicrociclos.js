class ListarMicrociclos {
    constructor(repo) { this.repo = repo }
    async ejecutar(mesocicloId) { return await this.repo.listarPorMesociclo(mesocicloId) }
  }
  module.exports = ListarMicrociclos