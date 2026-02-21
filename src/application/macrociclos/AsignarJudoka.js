class AsignarJudoka {
    constructor(repo) { this.repo = repo }
    async ejecutar(macrocicloId, judokaId) {
      return await this.repo.asignarJudoka(macrocicloId, judokaId)
    }
  }
  module.exports = AsignarJudoka