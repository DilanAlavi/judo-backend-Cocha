const {
  calcularVO2Navette,
  calcularVO2Mil500,
  calcularVO2Fuerza,
  calcularVO2Reps
} = require('../../src/shared/utils/calculos')

describe('OE3 — calculos.js (funciones puras)', () => {

  // ──────────────────────────────────────────
  describe('calcularVO2Navette', () => {

    it('UT-OE3-08: palier=10 retorna vo2 y velocidad correctos (Léger)', () => {
      // velocidad = 8 + (10 × 0.5) = 13 km/h
      // vo2 = (5.857 × 13) − 19.458 = 56.68
      const result = calcularVO2Navette(10)

      expect(result).not.toBeNull()
      expect(result.velocidad_kmh).toBe(13)
      expect(result.vo2).toBe(56.68)
    })

    it('UT-OE3-08b: palier=0 retorna null (entrada inválida)', () => {
      const result = calcularVO2Navette(0)
      expect(result).toBeNull()
    })

    it('UT-OE3-08c: palier negativo retorna null', () => {
      const result = calcularVO2Navette(-5)
      expect(result).toBeNull()
    })

  })

  // ──────────────────────────────────────────
  describe('calcularVO2Mil500', () => {

    it('UT-OE3-09: tiempo=300s retorna vo2 y velocidad correctos (ACSM)', () => {
      // 300s = 5 min → velocidad = 1500/5 = 300 m/min → 18 km/h
      // vo2 = 3.5 + (0.2 × 300) = 63.5
      const result = calcularVO2Mil500(300)

      expect(result).not.toBeNull()
      expect(result.vo2).toBe(63.5)
      expect(result.velocidad_kmh).toBe(18)
    })

    it('UT-OE3-09b: tiempo=0 retorna null (entrada inválida)', () => {
      const result = calcularVO2Mil500(0)
      expect(result).toBeNull()
    })

  })

  // ──────────────────────────────────────────
  describe('calcularVO2Fuerza', () => {

    it('UT-OE3-10: parámetros válidos retorna vo2 calculado correctamente', () => {
      // carga=100kg, recorrido=0.5m, tiempo=60s, peso=80kg
      // tiempo_min = 60/60 = 1
      // vo2 = (1.8 × 100 × 0.5) / (80 × 1) = 90/80 = 1.13
      const result = calcularVO2Fuerza(100, 0.5, 60, 80)

      expect(result).not.toBeNull()
      expect(typeof result).toBe('number')
      expect(result).toBe(1.13)
    })

    it('UT-OE3-10b: parámetro cero retorna null (protección contra división por cero)', () => {
      expect(calcularVO2Fuerza(0, 0.5, 60, 80)).toBeNull()
      expect(calcularVO2Fuerza(100, 0.5, 0, 80)).toBeNull()
      expect(calcularVO2Fuerza(100, 0.5, 60, 0)).toBeNull()
    })

  })

})
