class IUsuarioRepository {
    async obtenerPorAuthId(authUserId) { throw new Error('No implementado') }
    async obtenerPorCorreo(correo) { throw new Error('No implementado') }
  }
  
  module.exports = IUsuarioRepository