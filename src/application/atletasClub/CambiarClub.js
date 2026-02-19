const AppError = require('../../shared/errors/AppError')

class CambiarClub {
  constructor(atletaClubRepository) {
    this.atletaClubRepository = atletaClubRepository
  }

  async ejecutar(judokaId, nuevosDatos, usuarioRol) {
    if (!['admin', 'asociacion', 'sensei'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso', 403)
    }

    // Desactivar asignación actual
    const asignacionActiva = await this.atletaClubRepository.obtenerActivoPorJudoka(judokaId)
    if (!asignacionActiva) throw new AppError('El judoka no tiene club asignado', 404)

    await this.atletaClubRepository.desactivar(asignacionActiva.id, {
      activo: false,
      fechaSalida: new Date().toISOString().split('T')[0],
      motivoSalida: nuevosDatos.motivoSalida || 'Cambio de club'
    })

    // Crear nueva asignación
    return await this.atletaClubRepository.asignar({
      judokaId,
      clubId: nuevosDatos.clubId,
      senseiId: nuevosDatos.senseiId,
      categoria: nuevosDatos.categoria,
      pesoCompetitivo: nuevosDatos.pesoCompetitivo,
      cinturon: nuevosDatos.cinturon,
      fechaIngreso: new Date().toISOString().split('T')[0],
      activo: true,
      estado: 'activo'
    })
  }
}

module.exports = CambiarClub