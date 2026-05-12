/**
 * Actualiza peso_corporal y 1RM con valores DIVERSOS por mesociclo
 * para los judokas de Club Judo Cochabamba.
 * Recalcula los VO2 correspondientes después de cada cambio.
 */
const { createClient } = require('@supabase/supabase-js')

const sb = createClient(
  'https://bkieatnermhdmsqxhtih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraWVhdG5lcm1oZG1zcXhodGloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2NTI1MiwiZXhwIjoyMDgzODQxMjUyfQ.voWBImSfPSlhHE0o-jAgX8XyaNgzhVUIqNf63iOmh54'
)

// ── Fórmulas VO2 (copiadas de calculos.js) ─────────────────────────────────
function calcVO2Fuerza(carga, recorrido, tiempo_seg, peso) {
  if (!carga || !recorrido || !tiempo_seg || !peso) return null
  return Math.round((1.8 * carga * recorrido) / (peso * (tiempo_seg / 60)) * 100) / 100
}
function calcVO2Reps(reps, recorrido, tiempo_seg, peso) {
  if (!reps || !recorrido || !tiempo_seg || !peso) return null
  return Math.round((1.8 * reps * recorrido) / (tiempo_seg / 60) * 100) / 100
}
function calcVO2Mil500(segundos) {
  if (!segundos) return null
  const v = 1500 / (segundos / 60)
  return Math.round((3.5 + 0.2 * v) * 100) / 100
}
function calcVO2Navette(palier) {
  if (!palier) return null
  const v = 8 + palier * 0.5
  return Math.round((5.857 * v - 19.458) * 100) / 100
}

// ── Variaciones por judoka (peso base, delta por meso, 1RM base, tendencia) ──
// Formato: { pesoBase, pesoDeltas:[m1,m2,m3], press:[m1,m2,m3], tiron:[...], sent:[...] }
// Algunos suben, algunos bajan un meso y luego suben (realista)
const VARIACIONES = {
  'diego.fernandez@test.addjc.bo': {
    pesoBase: 73, pesoDeltas: [0, +1.5, -0.8],
    press: [80, 85, 82], tiron: [70, 75, 78], sent: [110, 115, 118],
  },
  'maria.condori@test.addjc.bo': {
    pesoBase: 58, pesoDeltas: [0, -1.2, -0.5],
    press: [42, 45, 47], tiron: [38, 40, 43], sent: [70, 68, 72],
  },
  'ana.quispe@test.addjc.bo': {
    pesoBase: 52, pesoDeltas: [0, +0.8, -1.0],
    press: [38, 40, 39], tiron: [32, 35, 37], sent: [62, 65, 68],
  },
  'andres.condori@test.addjc.bo': {
    pesoBase: 81, pesoDeltas: [0, +2.0, +1.0],
    press: [95, 100, 98], tiron: [85, 90, 92], sent: [130, 135, 140],
  },
  'carlos.mamani@test.addjc.bo': {
    pesoBase: 90, pesoDeltas: [0, -1.5, -2.0],
    press: [110, 108, 112], tiron: [95, 98, 100], sent: [150, 148, 155],
  },
  'nicolas.cruz@test.addjc.bo': {
    pesoBase: 66, pesoDeltas: [0, +1.0, -0.5],
    press: [72, 75, 78], tiron: [62, 65, 68], sent: [100, 105, 102],
  },
  'lucia.flores@test.addjc.bo': {
    pesoBase: 55, pesoDeltas: [0, -0.5, +0.8],
    press: [40, 42, 44], tiron: [35, 38, 40], sent: [68, 70, 72],
  },
  'sandra.condori@test.addjc.bo': {
    pesoBase: 60, pesoDeltas: [0, +1.5, +0.5],
    press: [45, 48, 50], tiron: [40, 43, 45], sent: [75, 78, 80],
  },
  'rosa.mamani@test.addjc.bo': {
    pesoBase: 63, pesoDeltas: [0, -1.0, +1.5],
    press: [50, 48, 52], tiron: [44, 46, 49], sent: [82, 80, 85],
  },
}

async function main() {
  console.log('=== Actualizando pesos y fuerza de judokas de Cochabamba ===\n')

  for (const [correo, var_] of Object.entries(VARIACIONES)) {
    // Obtener judoka_id via usuarios
    const { data: usuario } = await sb
      .from('usuarios')
      .select('id')
      .eq('correo', correo)
      .single()
    if (!usuario) { console.log(`⚠ No encontrado: ${correo}`); continue }

    const { data: judoka } = await sb
      .from('judokas')
      .select('id')
      .eq('usuario_id', usuario.id)
      .single()
    if (!judoka) { console.log(`⚠ Sin judoka: ${correo}`); continue }

    // Obtener todos sus tests ordenados por fecha_inicio del mesociclo
    const { data: tests } = await sb
      .from('tests_fisicos')
      .select('id, peso_corporal, press_1rm, press_recorrido, press_tiempo, tiron_1rm, tiron_recorrido, tiron_tiempo, sentadilla_1rm, sentadilla_recorrido, sentadilla_tiempo, barra_reps, barra_recorrido, barra_tiempo, paralelas_reps, paralelas_recorrido, paralelas_tiempo, mil500_segundos, navette_palier, mesociclos(fecha_inicio)')
      .eq('judoka_id', judoka.id)

    if (!tests || tests.length === 0) {
      console.log(`ℹ Sin tests: ${correo}`)
      continue
    }

    // Ordenar por fecha del mesociclo
    const ordenados = [...tests].sort((a, b) =>
      new Date(a.mesociclos?.fecha_inicio || 0).getTime() -
      new Date(b.mesociclos?.fecha_inicio || 0).getTime()
    )

    let actualizados = 0
    for (let i = 0; i < ordenados.length; i++) {
      const t = ordenados[i]
      const delta_idx = Math.min(i, var_.pesoDeltas.length - 1)
      const rm_idx    = Math.min(i, var_.press.length - 1)

      const nuevoPeso  = var_.pesoBase + var_.pesoDeltas[delta_idx]
      const nuevoPress = var_.press[rm_idx]
      const nuevoTiron = var_.tiron[rm_idx]
      const nuevoSent  = var_.sent[rm_idx]

      // Recalcular VO2 con nuevos valores
      const updates = {
        peso_corporal: nuevoPeso,
      }

      if (t.press_1rm && t.press_recorrido && t.press_tiempo) {
        updates.press_1rm  = nuevoPress
        updates.press_vo2  = calcVO2Fuerza(nuevoPress, t.press_recorrido, t.press_tiempo, nuevoPeso)
      }
      if (t.tiron_1rm && t.tiron_recorrido && t.tiron_tiempo) {
        updates.tiron_1rm  = nuevoTiron
        updates.tiron_vo2  = calcVO2Fuerza(nuevoTiron, t.tiron_recorrido, t.tiron_tiempo, nuevoPeso)
      }
      if (t.sentadilla_1rm && t.sentadilla_recorrido && t.sentadilla_tiempo) {
        updates.sentadilla_1rm  = nuevoSent
        updates.sentadilla_vo2  = calcVO2Fuerza(nuevoSent, t.sentadilla_recorrido, t.sentadilla_tiempo, nuevoPeso)
      }
      if (t.barra_reps && t.barra_recorrido && t.barra_tiempo) {
        updates.barra_vo2 = calcVO2Reps(t.barra_reps, t.barra_recorrido, t.barra_tiempo, nuevoPeso)
      }
      if (t.paralelas_reps && t.paralelas_recorrido && t.paralelas_tiempo) {
        updates.paralelas_vo2 = calcVO2Reps(t.paralelas_reps, t.paralelas_recorrido, t.paralelas_tiempo, nuevoPeso)
      }
      if (t.mil500_segundos) {
        updates.mil500_vo2 = calcVO2Mil500(t.mil500_segundos)
      }
      if (t.navette_palier) {
        updates.navette_vo2 = calcVO2Navette(t.navette_palier)
      }

      const { error } = await sb.from('tests_fisicos').update(updates).eq('id', t.id)
      if (error) { console.log(`  ✗ Error test ${t.id}:`, error.message) }
      else actualizados++
    }

    const pesos = ordenados.map((_, i) =>
      `${var_.pesoBase + var_.pesoDeltas[Math.min(i, var_.pesoDeltas.length - 1)]}kg`
    ).join(' → ')
    console.log(`✓ ${correo.split('@')[0].padEnd(22)} | ${ordenados.length} tests | Pesos: ${pesos}`)
  }

  console.log('\n✅ Actualización completada')
}

main().catch(console.error)
