class GetMisEvaluaciones {
    constructor(repo) {
      this.repo = repo
    }
  
    async ejecutar(judokaId) {
      return await this.repo.listarEvaluacionesJudoka(judokaId)
    }
  }
  
  module.exports = GetMisEvaluaciones