class ListarEjercicios {
    constructor(repo) { this.repo = repo }
    async ejecutar() { return await this.repo.listar() }
  }
  module.exports = ListarEjercicios