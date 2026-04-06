const CrearMicrociclo = require('../../src/application/microciclos/CrearMicrociclo')
const ObtenerMicrociclo = require('../../src/application/microciclos/ObtenerMicrociclo')
const AgregarEjercicio = require('../../src/application/microciclos/AgregarEjercicio')
const ActualizarEjercicio = require('../../src/application/microciclos/ActualizarEjercicio')
const EliminarEjercicio = require('../../src/application/microciclos/EliminarEjercicio')

describe('OE2 — Microciclos', () => {

  // ──────────────────────────────────────────
  describe('CrearMicrociclo', () => {

    it('UT-OE2-05: datos válidos retorna microciclo creado', async () => {
      const micro = { id: 1, mesocicloId: 'meso-1', estado: 'Pendiente' }
      const repo = { crear: jest.fn().mockResolvedValue(micro) }
      const useCase = new CrearMicrociclo(repo)

      const result = await useCase.ejecutar({ mesocicloId: 'meso-1' })

      expect(repo.crear).toHaveBeenCalledTimes(1)
      expect(result).toEqual(micro)
    })

    it('UT-OE2-06: mesociclo inexistente (error repo) se propaga', async () => {
      const repo = {
        crear: jest.fn().mockRejectedValue(new Error('mesociclo no existe'))
      }
      const useCase = new CrearMicrociclo(repo)

      await expect(useCase.ejecutar({ mesocicloId: 999 }))
        .rejects.toThrow('mesociclo no existe')
    })

  })

  // ──────────────────────────────────────────
  describe('ObtenerMicrociclo', () => {

    it('UT-OE2-07: ID válido retorna microciclo con ejercicios anidados', async () => {
      const micro = {
        id: 1,
        mesocicloId: 'meso-1',
        ejercicios: [{ id: 'e-1', nombre: 'Press', tiempo_modificado: 30 }]
      }
      const repo = { obtener: jest.fn().mockResolvedValue(micro) }
      const useCase = new ObtenerMicrociclo(repo)

      const result = await useCase.ejecutar(1)

      expect(repo.obtener).toHaveBeenCalledWith(1)
      expect(result).toEqual(micro)
      expect(result.ejercicios).toHaveLength(1)
    })

    it('UT-OE2-08: ID inexistente retorna null', async () => {
      const repo = { obtener: jest.fn().mockResolvedValue(null) }
      const useCase = new ObtenerMicrociclo(repo)

      const result = await useCase.ejecutar(999)

      expect(result).toBeNull()
    })

  })

  // ──────────────────────────────────────────
  describe('AgregarEjercicio', () => {

    it('UT-OE2-09: ejercicio no asignado crea relación en microciclo_ejercicios', async () => {
      const relacion = { id: 1, microcicloId: 'm-1', ejercicioId: 'e-1', orden: 1 }
      const repo = { agregarEjercicio: jest.fn().mockResolvedValue(relacion) }
      const useCase = new AgregarEjercicio(repo)

      const result = await useCase.ejecutar({ microcicloId: 'm-1', ejercicioId: 'e-1', orden: 1 })

      expect(repo.agregarEjercicio).toHaveBeenCalledTimes(1)
      expect(result).toEqual(relacion)
    })

    it('UT-OE2-10: ejercicio ya asignado (error repo) se propaga', async () => {
      const repo = {
        agregarEjercicio: jest.fn().mockRejectedValue(new Error('ejercicio ya asignado al microciclo'))
      }
      const useCase = new AgregarEjercicio(repo)

      await expect(useCase.ejecutar({ microcicloId: 'm-1', ejercicioId: 'e-1' }))
        .rejects.toThrow('ejercicio ya asignado al microciclo')
    })

  })

  // ──────────────────────────────────────────
  describe('ActualizarEjercicio (microciclo)', () => {

    it('UT-OE2-11: actualiza tiempo_modificado y series_modificadas correctamente', async () => {
      const actualizado = { id: 1, tiempo_modificado: 45, series_modificadas: 4 }
      const repo = { actualizarEjercicio: jest.fn().mockResolvedValue(actualizado) }
      const useCase = new ActualizarEjercicio(repo)

      const result = await useCase.ejecutar(1, { tiempo_modificado: 45, series_modificadas: 4 })

      expect(repo.actualizarEjercicio).toHaveBeenCalledWith(1, { tiempo_modificado: 45, series_modificadas: 4 })
      expect(result).toEqual(actualizado)
    })

  })

  // ──────────────────────────────────────────
  describe('EliminarEjercicio', () => {

    it('UT-OE2-12: relación inexistente (error repo) se propaga', async () => {
      const repo = {
        eliminarEjercicio: jest.fn().mockRejectedValue(new Error('relación no encontrada'))
      }
      const useCase = new EliminarEjercicio(repo)

      await expect(useCase.ejecutar(999))
        .rejects.toThrow('relación no encontrada')
    })

  })

})
