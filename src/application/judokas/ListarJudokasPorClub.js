class ListarJudokasPorClub {
    constructor(judokaRepository) {
      this.judokaRepository = judokaRepository
    }
  
    async ejecutar(clubId) {
      return await this.judokaRepository.listarPorClub(clubId)
    }
  }
  
  module.exports = ListarJudokasPorClub