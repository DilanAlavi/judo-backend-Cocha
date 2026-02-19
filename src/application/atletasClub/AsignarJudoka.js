const AppError = require('../../shared/errors/AppError')

class AsignarJudoka {
  constructor(atletaClubRepository) {
    this.atletaClubRepository = atletaClubRepository
  }

  async ejecutar(datos, usuarioRol) {
    if (!['admin', 'asociacion', 'sensei'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso para asignar judokas', 403)
    }
    if (!datos.judokaId || !datos.clubId) {
      throw new AppError('judokaId y clubId son requeridos', 400)
    }

    // Verificar si ya está activo en algún club
    const asignacionActiva = await this.atletaClubRepository.obtenerActivoPorJudoka(datos.judokaId)
    if (asignacionActiva) {
      throw new AppError('El judoka ya está asignado a un club, primero debes cambiarlo', 409)
    }

    return await this.atletaClubRepository.asignar({
      ...datos,
      fechaIngreso: new Date().toISOString().split('T')[0],
      activo: true,
      estado: 'activo'
    })
  }
}

module.exports = AsignarJudoka