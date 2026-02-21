class ListarMesociclos {
    constructor(repo) { this.repo = repo }
    async ejecutar(macrocicloId) { return await this.repo.listarPorMacrociclo(macrocicloId) }
  }
  module.exports = ListarMesociclos