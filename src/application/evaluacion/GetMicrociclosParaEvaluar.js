class GetMicrociclosParaEvaluar {
    constructor(repo) {
      this.repo = repo
    }
  
    async ejecutar(senseiId, filtroEstado) {
      return await this.repo.listarParaEvaluar(senseiId, filtroEstado)
    }
  }
  
  module.exports = GetMicrociclosParaEvaluar