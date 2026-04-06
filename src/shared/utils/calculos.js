/**
 * Utilidades de cálculo de VO2 máx
 * Basadas en fórmulas estándar de fisiología del ejercicio (ACSM)
 */

/**
 * VO2 para ejercicios de FUERZA con 1RM (Press, Tirón, Sentadilla)
 * Fórmula: VO2 = (1.8 × carga × recorrido) / (peso_corporal × tiempo_min)
 * @param {number} carga_kg       - 1RM en kg
 * @param {number} recorrido_m    - Recorrido de la barra en metros
 * @param {number} tiempo_seg     - Tiempo del movimiento en segundos
 * @param {number} peso_corporal  - Peso corporal del judoka en kg
 * @returns {number|null}
 */
function calcularVO2Fuerza(carga_kg, recorrido_m, tiempo_seg, peso_corporal) {
  if (!carga_kg || !recorrido_m || !tiempo_seg || !peso_corporal) return null
  if (tiempo_seg <= 0 || peso_corporal <= 0) return null
  const tiempo_min = tiempo_seg / 60
  const vo2 = (1.8 * carga_kg * recorrido_m) / (peso_corporal * tiempo_min)
  return Math.round(vo2 * 100) / 100
}

/**
 * VO2 para ejercicios de REPETICIONES (Barra Fija, Paralelas)
 * El atleta usa su peso corporal como carga
 * Fórmula: VO2 = (1.8 × reps × recorrido) / tiempo_total_min
 * @param {number} reps           - Número de repeticiones máximas
 * @param {number} recorrido_m    - Recorrido por repetición en metros
 * @param {number} tiempo_seg     - Tiempo total del ejercicio en segundos
 * @param {number} peso_corporal  - Peso corporal del judoka en kg
 * @returns {number|null}
 */
function calcularVO2Reps(reps, recorrido_m, tiempo_seg, peso_corporal) {
  if (!reps || !recorrido_m || !tiempo_seg || !peso_corporal) return null
  if (tiempo_seg <= 0 || peso_corporal <= 0) return null
  const tiempo_min = tiempo_seg / 60
  const vo2 = (1.8 * reps * peso_corporal * recorrido_m) / (peso_corporal * tiempo_min)
  return Math.round(vo2 * 100) / 100
}

/**
 * VO2 y velocidad para 1500m LISOS
 * Fórmula ACSM: VO2 = 3.5 + 0.2 × velocidad(m/min)
 * @param {number} segundos - Tiempo total en segundos
 * @returns {{ vo2: number, velocidad_kmh: number }|null}
 */
function calcularVO2Mil500(segundos) {
  if (!segundos || segundos <= 0) return null
  const tiempo_min = segundos / 60
  const velocidad_m_min = 1500 / tiempo_min
  const velocidad_kmh = (velocidad_m_min * 60) / 1000
  const vo2 = 3.5 + (0.2 * velocidad_m_min)
  return {
    vo2: Math.round(vo2 * 100) / 100,
    velocidad_kmh: Math.round(velocidad_kmh * 100) / 100
  }
}

/**
 * VO2 y velocidad para NAVETTE (Course Navette / Léger)
 * Velocidad por palier: speed = 8 + (palier × 0.5) km/h
 * Fórmula Léger & Boucher: VO2 = 5.857 × velocidad - 19.458
 * @param {number} palier - Palier alcanzado (ej: 10, 11.5)
 * @returns {{ vo2: number, velocidad_kmh: number }|null}
 */
function calcularVO2Navette(palier) {
  if (!palier || palier <= 0) return null
  const velocidad_kmh = 8 + (palier * 0.5)
  const vo2 = (5.857 * velocidad_kmh) - 19.458
  return {
    vo2: Math.round(vo2 * 100) / 100,
    velocidad_kmh: Math.round(velocidad_kmh * 100) / 100
  }
}

/**
 * Formatea segundos a string "m:ss" (ej: 300 → "5:00")
 * @param {number} segundos
 * @returns {string}
 */
function formatearTiempo(segundos) {
  if (!segundos) return '—'
  const min = Math.floor(segundos / 60)
  const seg = segundos % 60
  return `${min}:${seg.toString().padStart(2, '0')}`
}

/**
 * Calcula todos los VO2 de un test y devuelve el objeto completo listo para guardar
 * @param {Object} datos - Datos crudos del formulario
 * @returns {Object} - Datos con VO2 calculados
 */
function calcularTodosVO2(datos) {
  const peso = datos.peso_corporal

  // PRESS
  if (datos.press_1rm && datos.press_recorrido && datos.press_tiempo) {
    datos.press_vo2 = calcularVO2Fuerza(datos.press_1rm, datos.press_recorrido, datos.press_tiempo, peso)
  }

  // TIRÓN
  if (datos.tiron_1rm && datos.tiron_recorrido && datos.tiron_tiempo) {
    datos.tiron_vo2 = calcularVO2Fuerza(datos.tiron_1rm, datos.tiron_recorrido, datos.tiron_tiempo, peso)
  }

  // SENTADILLA
  if (datos.sentadilla_1rm && datos.sentadilla_recorrido && datos.sentadilla_tiempo) {
    datos.sentadilla_vo2 = calcularVO2Fuerza(datos.sentadilla_1rm, datos.sentadilla_recorrido, datos.sentadilla_tiempo, peso)
  }

  // BARRA FIJA
  if (datos.barra_reps && datos.barra_recorrido && datos.barra_tiempo) {
    datos.barra_vo2 = calcularVO2Reps(datos.barra_reps, datos.barra_recorrido, datos.barra_tiempo, peso)
  }

  // PARALELAS
  if (datos.paralelas_reps && datos.paralelas_recorrido && datos.paralelas_tiempo) {
    datos.paralelas_vo2 = calcularVO2Reps(datos.paralelas_reps, datos.paralelas_recorrido, datos.paralelas_tiempo, peso)
  }

  // 1500m
  if (datos.mil500_segundos) {
    const res = calcularVO2Mil500(datos.mil500_segundos)
    if (res) {
      datos.mil500_vo2 = res.vo2
      datos.mil500_velocidad = res.velocidad_kmh
    }
  }

  // NAVETTE
  if (datos.navette_palier) {
    const res = calcularVO2Navette(datos.navette_palier)
    if (res) {
      datos.navette_vo2 = res.vo2
      datos.navette_velocidad = res.velocidad_kmh
    }
  }

  return datos
}

module.exports = {
  calcularVO2Fuerza,
  calcularVO2Reps,
  calcularVO2Mil500,
  calcularVO2Navette,
  calcularTodosVO2,
  formatearTiempo
}
