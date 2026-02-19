class Club {
    constructor({ id, nombre, direccion, telefono, senseiId, activo, createdAt }) {
      this.id = id
      this.nombre = nombre
      this.direccion = direccion
      this.telefono = telefono
      this.senseiId = senseiId
      this.activo = activo
      this.createdAt = createdAt
    }
  }
  
  module.exports = Club