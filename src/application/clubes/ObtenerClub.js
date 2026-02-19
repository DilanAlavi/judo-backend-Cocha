const AppError = require('../../shared/errors/AppError')

class ObtenerClub {
  constructor(clubRepository) {
    this.clubRepository = clubRepository
  }

  async ejecutar(id) {
    const club = await this.clubRepository.obtenerPorId(id)
    if (!club) throw new AppError('Club no encontrado', 404)
    return club
  }
}

module.exports = ObtenerClub