class AgregarEjercicio {
    constructor(repo) { this.repo = repo }
    async ejecutar(datos) { return await this.repo.agregarEjercicio(datos) }
  }
  module.exports = AgregarEjercicio