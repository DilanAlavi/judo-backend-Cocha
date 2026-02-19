class IClubRepository {
    async crear(datos) { throw new Error('No implementado') }
    async listar() { throw new Error('No implementado') }
    async obtenerPorId(id) { throw new Error('No implementado') }
    async obtenerPorSensei(senseiId) { throw new Error('No implementado') }
    async actualizar(id, datos) { throw new Error('No implementado') }
  }
  
  module.exports = IClubRepository