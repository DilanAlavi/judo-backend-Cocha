const ListarJudokasPorClub = require('../../src/application/judokas/ListarJudokasPorClub')

describe('OE1 — Judokas', () => {

  // ──────────────────────────────────────────
  describe('ListarJudokasPorClub', () => {

    it('UT-OE1-07: retorna lista de judokas del club', async () => {
      const lista = [
        { id: 'j-1', nombre: 'Carlos Vega', clubId: 'c-1' },
        { id: 'j-2', nombre: 'Ana Torres', clubId: 'c-1' }
      ]
      const repo = { listarPorClub: jest.fn().mockResolvedValue(lista) }
      const useCase = new ListarJudokasPorClub(repo)

      const result = await useCase.ejecutar('c-1')

      expect(repo.listarPorClub).toHaveBeenCalledWith('c-1')
      expect(result).toHaveLength(2)
      expect(result).toEqual(lista)
    })

    it('UT-OE1-08: club sin judokas retorna array vacío', async () => {
      const repo = { listarPorClub: jest.fn().mockResolvedValue([]) }
      const useCase = new ListarJudokasPorClub(repo)

      const result = await useCase.ejecutar('c-vacio')

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

  })

})
