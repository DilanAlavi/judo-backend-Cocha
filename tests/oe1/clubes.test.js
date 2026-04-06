const CrearClub = require('../../src/application/clubes/CrearClub')
const ObtenerClub = require('../../src/application/clubes/ObtenerClub')
const ActualizarClub = require('../../src/application/clubes/ActualizarClub')
const AppError = require('../../src/shared/errors/AppError')

describe('OE1 — Clubes', () => {

  // ──────────────────────────────────────────
  describe('CrearClub', () => {

    it('UT-OE1-01: rol admin con datos válidos retorna club creado', async () => {
      const clubMock = { id: 1, nombre: 'Club Judo Quito' }
      const repo = { crear: jest.fn().mockResolvedValue(clubMock) }
      const useCase = new CrearClub(repo)

      const result = await useCase.ejecutar({ nombre: 'Club Judo Quito' }, 'admin')

      expect(repo.crear).toHaveBeenCalledTimes(1)
      expect(result).toEqual(clubMock)
    })

    it('UT-OE1-02: nombre vacío lanza AppError 400', async () => {
      const repo = { crear: jest.fn() }
      const useCase = new CrearClub(repo)

      await expect(useCase.ejecutar({}, 'admin'))
        .rejects.toMatchObject({ statusCode: 400 })
      expect(repo.crear).not.toHaveBeenCalled()
    })

  })

  // ──────────────────────────────────────────
  describe('ObtenerClub', () => {

    it('UT-OE1-03: ID válido retorna datos del club', async () => {
      const clubMock = { id: 1, nombre: 'Club Judo Quito' }
      const repo = { obtenerPorId: jest.fn().mockResolvedValue(clubMock) }
      const useCase = new ObtenerClub(repo)

      const result = await useCase.ejecutar(1)

      expect(result).toEqual(clubMock)
      expect(repo.obtenerPorId).toHaveBeenCalledWith(1)
    })

    it('UT-OE1-04: ID inexistente lanza AppError 404', async () => {
      const repo = { obtenerPorId: jest.fn().mockResolvedValue(null) }
      const useCase = new ObtenerClub(repo)

      await expect(useCase.ejecutar(999))
        .rejects.toMatchObject({ statusCode: 404 })
    })

  })

  // ──────────────────────────────────────────
  describe('ActualizarClub', () => {

    it('UT-OE1-05: datos válidos actualiza y retorna club', async () => {
      const clubActualizado = { id: 1, nombre: 'Club Actualizado' }
      const repo = {
        obtenerPorId: jest.fn().mockResolvedValue({ id: 1 }),
        actualizar: jest.fn().mockResolvedValue(clubActualizado)
      }
      const useCase = new ActualizarClub(repo)

      const result = await useCase.ejecutar(1, { nombre: 'Club Actualizado' }, 'admin')

      expect(repo.actualizar).toHaveBeenCalledWith(1, { nombre: 'Club Actualizado' })
      expect(result).toEqual(clubActualizado)
    })

    it('UT-OE1-06: club no existe lanza AppError 404', async () => {
      const repo = {
        obtenerPorId: jest.fn().mockResolvedValue(null),
        actualizar: jest.fn()
      }
      const useCase = new ActualizarClub(repo)

      await expect(useCase.ejecutar(999, { nombre: 'X' }, 'admin'))
        .rejects.toMatchObject({ statusCode: 404 })
      expect(repo.actualizar).not.toHaveBeenCalled()
    })

  })

})
