class ListarJudokasSinClub {
    constructor(judokaRepository) {
      this.judokaRepository = judokaRepository
    }
  
    async ejecutar() {
      return await this.judokaRepository.listarSinClub()
    }
  }
  
  module.exports = ListarJudokasSinClub