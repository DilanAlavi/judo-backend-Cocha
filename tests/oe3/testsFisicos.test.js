const CrearTestFisico = require('../../src/application/tests_fisicos/CrearTestFisico')
const ActualizarTestFisico = require('../../src/application/tests_fisicos/ActualizarTestFisico')
const ListarPorJudoka = require('../../src/application/tests_fisicos/ListarPorJudoka')
const ListarPorMesociclo = require('../../src/application/tests_fisicos/ListarPorMesociclo')

describe('OE3 — Tests Físicos', () => {

  describe('CrearTestFisico', () => {

    it('UT-OE3-01: calcula VO2 de navette antes de guardar y llama repo.crear', async () => {
      const testCreado = { id: 1, navette_palier: 10, navette_vo2: 56.68 }
      const repo = { crear: jest.fn().mockResolvedValue(testCreado) }
      const useCase = new CrearTestFisico(repo)

      const result = await useCase.ejecutar({
        peso_corporal: 70,
        navette_palier: 10
      })

      expect(repo.crear).toHaveBeenCalledTimes(1)

      const datosPasados = repo.crear.mock.calls[0][0]
      expect(datosPasados.navette_vo2).toBeDefined()
      expect(typeof datosPasados.navette_vo2).toBe('number')
      expect(result).toEqual(testCreado)
    })

    it('UT-OE3-02: repo lanza error (judoka inexistente) se propaga', async () => {
      const repo = {
        crear: jest.fn().mockRejectedValue(new Error('judoka no existe'))
      }
      const useCase = new CrearTestFisico(repo)

      await expect(useCase.ejecutar({ peso_corporal: 70, navette_palier: 8 }))
        .rejects.toThrow('judoka no existe')
    })

  })

  describe('ActualizarTestFisico', () => {

    it('UT-OE3-03: recalcula métricas y actualiza registro en repo', async () => {
      const testActualizado = { id: 1, navette_palier: 11, navette_vo2: 62.53 }
      const repo = { actualizar: jest.fn().mockResolvedValue(testActualizado) }
      const useCase = new ActualizarTestFisico(repo)

      const result = await useCase.ejecutar(1, { peso_corporal: 72, navette_palier: 11 })

      expect(repo.actualizar).toHaveBeenCalledTimes(1)
      // Verificar que recalculó antes de actualizar
      const datosPasados = repo.actualizar.mock.calls[0][1]
      expect(datosPasados.navette_vo2).toBeDefined()
      expect(result).toEqual(testActualizado)
    })

    it('UT-OE3-04: test inexistente (error repo) se propaga', async () => {
      const repo = {
        actualizar: jest.fn().mockRejectedValue(new Error('test físico no encontrado'))
      }
      const useCase = new ActualizarTestFisico(repo)

      await expect(useCase.ejecutar(999, {}))
        .rejects.toThrow('test físico no encontrado')
    })

  })

  describe('ListarPorJudoka', () => {

    it('UT-OE3-05: retorna lista de tests del judoka', async () => {
      const lista = [
        { id: 1, judokaId: 'j-1', fecha: '2024-01-15', navette_vo2: 50.2 },
        { id: 2, judokaId: 'j-1', fecha: '2024-06-20', navette_vo2: 54.8 }
      ]
      const repo = { listarPorJudoka: jest.fn().mockResolvedValue(lista) }
      const useCase = new ListarPorJudoka(repo)

      const result = await useCase.ejecutar('j-1')

      expect(repo.listarPorJudoka).toHaveBeenCalledWith('j-1')
      expect(result).toHaveLength(2)
      expect(result).toEqual(lista)
    })

    it('UT-OE3-06: judoka sin tests registrados retorna array vacío', async () => {
      const repo = { listarPorJudoka: jest.fn().mockResolvedValue([]) }
      const useCase = new ListarPorJudoka(repo)

      const result = await useCase.ejecutar('j-nuevo')

      expect(result).toEqual([])
    })

  })

  
  describe('ListarPorMesociclo', () => {

    it('UT-OE3-07: retorna todos los tests del mesociclo', async () => {
      const lista = [
        { id: 1, mesocicloId: 'meso-1', judokaId: 'j-1' },
        { id: 2, mesocicloId: 'meso-1', judokaId: 'j-2' }
      ]
      const repo = { listarPorMesociclo: jest.fn().mockResolvedValue(lista) }
      const useCase = new ListarPorMesociclo(repo)

      const result = await useCase.ejecutar('meso-1')

      expect(repo.listarPorMesociclo).toHaveBeenCalledWith('meso-1')
      expect(result).toHaveLength(2)
      expect(result).toEqual(lista)
    })

  })

})
