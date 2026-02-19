class AtletaClub {
    constructor({ id, judokaId, clubId, senseiId, categoria, pesoCompetitivo, cinturon, fechaIngreso, fechaSalida, motivoSalida, estado, activo }) {
      this.id = id
      this.judokaId = judokaId
      this.clubId = clubId
      this.senseiId = senseiId
      this.categoria = categoria
      this.pesoCompetitivo = pesoCompetitivo
      this.cinturon = cinturon
      this.fechaIngreso = fechaIngreso
      this.fechaSalida = fechaSalida
      this.motivoSalida = motivoSalida
      this.estado = estado // activo, inactivo, lesionado, retirado
      this.activo = activo
    }
  }
  
  module.exports = AtletaClub