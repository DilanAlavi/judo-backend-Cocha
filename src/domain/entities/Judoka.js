class Judoka {
    constructor({ id, usuarioId, nombre, apellidoPaterno, apellidoMaterno, correo, fechaNacimiento, genero, ci, activo }) {
      this.id = id
      this.usuarioId = usuarioId
      this.nombre = nombre
      this.apellidoPaterno = apellidoPaterno
      this.apellidoMaterno = apellidoMaterno
      this.correo = correo
      this.fechaNacimiento = fechaNacimiento
      this.genero = genero
      this.ci = ci
      this.activo = activo
    }
  }
  
  module.exports = Judoka