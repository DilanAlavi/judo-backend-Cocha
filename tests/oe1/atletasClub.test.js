const AsignarJudoka = require('../../src/application/atletasClub/AsignarJudoka')
const DesactivarJudoka = require('../../src/application/atletasClub/DesactivarJudoka')

describe('OE1 — AtletasClub', () => {

  // ──────────────────────────────────────────
  describe('AsignarJudoka', () => {

    it('UT-OE1-09: judoka sin club previo se asigna correctamente', async () => {
      const asignacion = { id: 1, judokaId: 'j-1', clubId: 'c-1', activo: true }
      const repo = {
        obtenerActivoPorJudoka: jest.fn().mockResolvedValue(null),
        asignar: jest.fn().mockResolvedValue(asignacion)
      }
      const useCase = new AsignarJudoka(repo)

      const result = await useCase.ejecutar({ judokaId: 'j-1', clubId: 'c-1' }, 'sensei')

      expect(repo.obtenerActivoPorJudoka).toHaveBeenCalledWith('j-1')
      expect(repo.asignar).toHaveBeenCalledTimes(1)
      expect(result).toEqual(asignacion)
    })

    it('UT-OE1-10: judoka ya asignado a un club lanza AppError 409', async () => {
      const repo = {
        obtenerActivoPorJudoka: jest.fn().mockResolvedValue({ id: 99, activo: true }),
        asignar: jest.fn()
      }
      const useCase = new AsignarJudoka(repo)

      await expect(useCase.ejecutar({ judokaId: 'j-1', clubId: 'c-2' }, 'sensei'))
        .rejects.toMatchObject({ statusCode: 409 })
      expect(repo.asignar).not.toHaveBeenCalled()
    })

  })

  // ──────────────────────────────────────────
  describe('DesactivarJudoka', () => {

    it('UT-OE1-11: judoka activo en club se desactiva correctamente', async () => {
      const desactivado = { id: 99, activo: false, estado: 'inactivo' }
      const repo = {
        obtenerActivoPorJudoka: jest.fn().mockResolvedValue({ id: 99 }),
        desactivar: jest.fn().mockResolvedValue(desactivado)
      }
      const useCase = new DesactivarJudoka(repo)

      const result = await useCase.ejecutar('j-1', { motivoSalida: 'Fin de temporada' }, 'sensei')

      expect(repo.desactivar).toHaveBeenCalledTimes(1)
      expect(result).toEqual(desactivado)
    })

    it('UT-OE1-12: judoka sin asignación activa lanza AppError 404', async () => {
      const repo = {
        obtenerActivoPorJudoka: jest.fn().mockResolvedValue(null),
        desactivar: jest.fn()
      }
      const useCase = new DesactivarJudoka(repo)

      await expect(useCase.ejecutar('j-2', {}, 'sensei'))
        .rejects.toMatchObject({ statusCode: 404 })
      expect(repo.desactivar).not.toHaveBeenCalled()
    })

  })

})
