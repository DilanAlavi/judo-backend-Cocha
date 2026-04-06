const CrearMacrociclo = require('../../src/application/macrociclos/CrearMacrociclo')
const CrearMesociclo = require('../../src/application/mesociclos/CrearMesociclo')
const HistorialJudoka = require('../../src/application/atletasClub/HistorialJudoka')

describe('OE1 — Macrociclos, Mesociclos e Historial', () => {

  // ──────────────────────────────────────────
  describe('CrearMacrociclo', () => {

    it('UT-OE1-13: datos válidos retorna macrociclo creado', async () => {
      const macro = { id: 1, nombre: 'Macrociclo 2025', senseiId: 's-1' }
      const repo = { crear: jest.fn().mockResolvedValue(macro) }
      const useCase = new CrearMacrociclo(repo)

      const result = await useCase.ejecutar({ nombre: 'Macrociclo 2025', senseiId: 's-1' })

      expect(repo.crear).toHaveBeenCalledTimes(1)
      expect(result).toEqual(macro)
    })

  })

  // ──────────────────────────────────────────
  describe('CrearMesociclo', () => {

    it('UT-OE1-14: error en repo (macrociclo inexistente) se propaga correctamente', async () => {
      const repo = {
        crear: jest.fn().mockRejectedValue(new Error('macrociclo no existe'))
      }
      const useCase = new CrearMesociclo(repo)

      await expect(useCase.ejecutar({ macrocicloId: 999, nombre: 'Meso 1' }))
        .rejects.toThrow('macrociclo no existe')
    })

  })

  // ──────────────────────────────────────────
  describe('HistorialJudoka', () => {

    it('UT-OE1-15: retorna historial de clubes del judoka ordenado', async () => {
      const historial = [
        { clubId: 'c-1', fechaIngreso: '2023-01-01', activo: false },
        { clubId: 'c-2', fechaIngreso: '2024-01-01', activo: true }
      ]
      const repo = { historialPorJudoka: jest.fn().mockResolvedValue(historial) }
      const useCase = new HistorialJudoka(repo)

      const result = await useCase.ejecutar('j-1')

      expect(repo.historialPorJudoka).toHaveBeenCalledWith('j-1')
      expect(result).toEqual(historial)
      expect(result).toHaveLength(2)
    })

  })

})
