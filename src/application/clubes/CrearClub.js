const AppError = require('../../shared/errors/AppError')

class CrearClub {
  constructor(clubRepository) {
    this.clubRepository = clubRepository
  }

  async ejecutar(datos, usuarioRol) {
    if (!['admin', 'asociacion'].includes(usuarioRol)) {
      throw new AppError('No tienes permiso para crear clubes', 403)
    }
    if (!datos.nombre) throw new AppError('El nombre del club es requerido', 400)

    return await this.clubRepository.crear(datos)
  }
}

module.exports = CrearClub