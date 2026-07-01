const {
  calcularICF,
  calcularRatioFuerzaPeso
} = require('../../src/shared/utils/calculos')

describe('OE3 — Indicadores de condición física', () => {

  // ──────────────────────────────────────────
  describe('calcularICF', () => {

    it('UT-OE3-11: array con múltiples VO₂ retorna promedio correcto', () => {
      // (56.68 + 63.5 + 1.13) / 3 = 40.44
      const result = calcularICF([56.68, 63.5, 1.13])

      expect(result).not.toBeNull()
      expect(result).toBe(40.44)
    })

    it('UT-OE3-12: array con un solo valor retorna ese mismo valor', () => {
      const result = calcularICF([56.68])

      expect(result).toBe(56.68)
    })

    it('UT-OE3-13: array con valores null se ignoran y calcula con los válidos', () => {
      // (56.68 + 63.5) / 2 = 60.09
      const result = calcularICF([56.68, null, 63.5, null])

      expect(result).toBe(60.09)
    })

    it('UT-OE3-14: array vacío retorna null', () => {
      const result = calcularICF([])

      expect(result).toBeNull()
    })

    it('UT-OE3-15: array solo con nulls retorna null', () => {
      const result = calcularICF([null, null])

      expect(result).toBeNull()
    })

  })

  // ──────────────────────────────────────────
  describe('calcularRatioFuerzaPeso', () => {

    it('UT-OE3-16: 1RM y peso válidos retorna ratio correcto', () => {
      // 100 / 80 = 1.25
      const result = calcularRatioFuerzaPeso(100, 80)

      expect(result).not.toBeNull()
      expect(result).toBe(1.25)
    })

    it('UT-OE3-17: peso cero retorna null (protección división por cero)', () => {
      const result = calcularRatioFuerzaPeso(100, 0)

      expect(result).toBeNull()
    })

    it('UT-OE3-18: 1RM cero retorna null', () => {
      const result = calcularRatioFuerzaPeso(0, 80)

      expect(result).toBeNull()
    })

  })

})
