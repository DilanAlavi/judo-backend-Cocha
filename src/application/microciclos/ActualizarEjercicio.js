class ActualizarEjercicio {
    constructor(repo) { this.repo = repo }
    async ejecutar(id, datos) { return await this.repo.actualizarEjercicio(id, datos) }
  }
  module.exports = ActualizarEjercicio