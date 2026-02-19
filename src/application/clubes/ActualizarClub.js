const AppError = require('../../shared/errors/AppError')

class ActualizarClub {
  constructor(clubRepository) {
    this.clubRepository = clubRepository
  }

  async ejecutar(id, datos, usuarioRol) {
    if (!['admin', 'asociacion'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso para actualizar clubes', 403)
    }
    const club = await this.clubRepository.obtenerPorId(id)
    if (!club) throw new AppError('Club no encontrado', 404)

    return await this.clubRepository.actualizar(id, datos)
  }
}

module.exports = ActualizarClub