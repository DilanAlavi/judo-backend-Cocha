class ListarPorJudoka {
  constructor(repo) { this.repo = repo }
  async ejecutar(judokaId) {
    return await this.repo.listarPorJudoka(judokaId)
  }
}
module.exports = ListarPorJudoka
