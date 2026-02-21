class ListarMacrociclos {
    constructor(repo) { this.repo = repo }
    async ejecutar(senseiId) { return await this.repo.listarPorSensei(senseiId) }
  }
  module.exports = ListarMacrociclos