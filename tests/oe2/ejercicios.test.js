const CrearEjercicio = require('../../src/application/ejercicios/CrearEjercicio')
const ListarEjercicios = require('../../src/application/ejercicios/ListarEjercicios')
const ActualizarEjercicio = require('../../src/application/ejercicios/ActualizarEjercicio')

describe('OE2 — Ejercicios', () => {

  // ──────────────────────────────────────────
  describe('CrearEjercicio', () => {

    it('UT-OE2-01: datos válidos retorna ejercicio creado con activo = true', async () => {
      const ejercicio = { id: 1, nombre: 'Sentadilla', categoria: 'fuerza', activo: true }
      const repo = { crear: jest.fn().mockResolvedValue(ejercicio) }
      const useCase = new CrearEjercicio(repo)

      const result = await useCase.ejecutar({ nombre: 'Sentadilla', categoria: 'fuerza' })

      expect(repo.crear).toHaveBeenCalledTimes(1)
      expect(result).toEqual(ejercicio)
    })

    it('UT-OE2-02: repo lanza error por nombre duplicado se propaga', async () => {
      const repo = {
        crear: jest.fn().mockRejectedValue(new Error('nombre duplicado en banco de ejercicios'))
      }
      const useCase = new CrearEjercicio(repo)

      await expect(useCase.ejecutar({ nombre: 'Sentadilla' }))
        .rejects.toThrow('nombre duplicado en banco de ejercicios')
    })

  })

  // ──────────────────────────────────────────
  describe('ListarEjercicios', () => {

    it('UT-OE2-03: retorna lista de ejercicios activos', async () => {
      const lista = [
        { id: 1, nombre: 'Press Banca', activo: true },
        { id: 2, nombre: 'Barra Fija', activo: true }
      ]
      const repo = { listar: jest.fn().mockResolvedValue(lista) }
      const useCase = new ListarEjercicios(repo)

      const result = await useCase.ejecutar()

      expect(result).toEqual(lista)
      expect(result).toHaveLength(2)
    })

    it('UT-OE2-03b: sin ejercicios activos retorna array vacío', async () => {
      const repo = { listar: jest.fn().mockResolvedValue([]) }
      const useCase = new ListarEjercicios(repo)

      const result = await useCase.ejecutar()

      expect(result).toEqual([])
    })

  })

  // ──────────────────────────────────────────
  describe('ActualizarEjercicio', () => {

    it('UT-OE2-04: repo lanza error (ejercicio no existe) se propaga', async () => {
      const repo = {
        actualizar: jest.fn().mockRejectedValue(new Error('ejercicio no encontrado'))
      }
      const useCase = new ActualizarEjercicio(repo)

      await expect(useCase.ejecutar(999, { nombre: 'Nuevo Nombre' }))
        .rejects.toThrow('ejercicio no encontrado')
    })

  })

})
