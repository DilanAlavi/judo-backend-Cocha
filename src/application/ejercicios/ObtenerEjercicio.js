class ObtenerEjercicio {
    constructor(repo) { this.repo = repo }
    async ejecutar(id) { return await this.repo.obtener(id) }
  }
  module.exports = ObtenerEjercicio