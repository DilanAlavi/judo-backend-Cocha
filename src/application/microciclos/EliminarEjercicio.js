class EliminarEjercicio {
    constructor(repo) { this.repo = repo }
    async ejecutar(id) { return await this.repo.eliminarEjercicio(id) }
  }
  module.exports = EliminarEjercicio