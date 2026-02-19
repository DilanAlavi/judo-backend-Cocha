class IAtletaClubRepository {
    async asignar(datos) { throw new Error('No implementado') }
    async obtenerActivoPorJudoka(judokaId) { throw new Error('No implementado') }
    async historialPorJudoka(judokaId) { throw new Error('No implementado') }
    async desactivar(id, datos) { throw new Error('No implementado') }
  }
  
  module.exports = IAtletaClubRepository