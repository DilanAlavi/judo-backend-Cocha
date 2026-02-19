class HistorialJudoka {
    constructor(atletaClubRepository) {
      this.atletaClubRepository = atletaClubRepository
    }
  
    async ejecutar(judokaId) {
      return await this.atletaClubRepository.historialPorJudoka(judokaId)
    }
  }
  
  module.exports = HistorialJudoka