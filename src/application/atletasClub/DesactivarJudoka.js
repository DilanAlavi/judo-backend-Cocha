const AppError = require('../../shared/errors/AppError')

class DesactivarJudoka {
  constructor(atletaClubRepository) {
    this.atletaClubRepository = atletaClubRepository
  }

  async ejecutar(judokaId, datos, usuarioRol) {
    if (!['admin', 'asociacion', 'sensei'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso', 403)
    }

    const asignacionActiva = await this.atletaClubRepository.obtenerActivoPorJudoka(judokaId)
    if (!asignacionActiva) throw new AppError('El judoka no tiene asignación activa', 404)

    return await this.atletaClubRepository.desactivar(asignacionActiva.id, {
      activo: false,
      fechaSalida: new Date().toISOString().split('T')[0],
      motivoSalida: datos.motivoSalida || 'Desactivado',
      estado: datos.estado || 'inactivo' // inactivo, lesionado, retirado
    })
  }
}

module.exports = DesactivarJudoka