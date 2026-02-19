class ListarClubes {
    constructor(clubRepository) {
      this.clubRepository = clubRepository
    }
  
    async ejecutar(usuario) {
      if (['admin', 'asociacion'].includes(usuario.rol)) {
        return await this.clubRepository.listar()
      }
      if (usuario.rol === 'sensei') {
        return await this.clubRepository.obtenerPorDirectorTecnico(usuario.senseiId)
      }
      throw new Error('Sin acceso')
    }
  }
  
  module.exports = ListarClubes