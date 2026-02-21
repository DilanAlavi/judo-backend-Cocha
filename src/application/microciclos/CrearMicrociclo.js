class CrearMicrociclo {
    constructor(repo) { this.repo = repo }
    async ejecutar(datos) { return await this.repo.crear(datos) }
  }
  module.exports = CrearMicrociclo