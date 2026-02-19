class Usuario {
    constructor({ id, authUserId, nombre, apellidoPaterno, apellidoMaterno, correo, rol, activo }) {
      this.id = id
      this.authUserId = authUserId
      this.nombre = nombre
      this.apellidoPaterno = apellidoPaterno
      this.apellidoMaterno = apellidoMaterno
      this.correo = correo
      this.rol = rol
      this.activo = activo
    }
  }
  
  module.exports = Usuario