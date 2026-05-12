/**
 * Crea microciclos semanales para los mesociclos de Club Judo Cochabamba
 * y asigna automáticamente los judocas del mesociclo a cada microciclo.
 */
const { createClient } = require('@supabase/supabase-js')

const sb = createClient(
  'https://bkieatnermhdmsqxhtih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraWVhdG5lcm1oZG1zcXhodGloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2NTI1MiwiZXhwIjoyMDgzODQxMjUyfQ.voWBImSfPSlhHE0o-jAgX8XyaNgzhVUIqNf63iOmh54'
)

const CORREOS_CBBA = [
  'diego.fernandez@test.addjc.bo',
  'maria.condori@test.addjc.bo',
  'ana.quispe@test.addjc.bo',
  'andres.condori@test.addjc.bo',
  'carlos.mamani@test.addjc.bo',
  'nicolas.cruz@test.addjc.bo',
  'lucia.flores@test.addjc.bo',
  'sandra.condori@test.addjc.bo',
  'rosa.mamani@test.addjc.bo',
]

// Genera un lunes por semana entre fecha_inicio y fecha_fin
function generarLunes(fechaIni, fechaFin) {
  const lunes = []
  const d = new Date(fechaIni)
  const diaSemana = d.getDay()
  if (diaSemana !== 1) d.setDate(d.getDate() + ((8 - diaSemana) % 7))
  const fin = new Date(fechaFin)
  while (d <= fin) {
    lunes.push(d.toISOString().split('T')[0])
    d.setDate(d.getDate() + 7)
  }
  return lunes
}

async function main() {
  console.log('=== Microciclos — Club Judo Cochabamba ===\n')

  // 1. Obtener judoka_ids de Cochabamba
  const { data: usuarios } = await sb
    .from('usuarios').select('id').in('correo', CORREOS_CBBA)

  const usuarioIds = (usuarios || []).map(u => u.id)

  const { data: judokas } = await sb
    .from('judokas').select('id').in('usuario_id', usuarioIds)

  const judokaIds = (judokas || []).map(j => j.id)
  console.log(`Judocas Cochabamba: ${judokaIds.length}`)
  if (!judokaIds.length) return

  // 2. Mesociclos donde participan estos judocas
  const { data: mesoJudokas } = await sb
    .from('mesociclo_judokas').select('mesociclo_id, judoka_id').in('judoka_id', judokaIds)

  const mesoIds = [...new Set((mesoJudokas || []).map(m => m.mesociclo_id))]
  console.log(`Mesociclos encontrados: ${mesoIds.length}\n`)
  if (!mesoIds.length) return

  // Agrupar judokas por mesociclo
  const judokasPorMeso = {}
  for (const mj of mesoJudokas) {
    if (!judokasPorMeso[mj.mesociclo_id]) judokasPorMeso[mj.mesociclo_id] = []
    judokasPorMeso[mj.mesociclo_id].push(mj.judoka_id)
  }

  // 3. Datos de cada mesociclo
  const { data: mesociclos } = await sb
    .from('mesociclos').select('id, nombre, fecha_inicio, fecha_fin')
    .in('id', mesoIds).order('fecha_inicio', { ascending: true })

  let totalCreados = 0
  let totalSkip = 0

  for (const meso of mesociclos) {
    const judocasMeso = judokasPorMeso[meso.id] || []
    const fechas = generarLunes(meso.fecha_inicio, meso.fecha_fin)

    console.log(`📅 ${meso.nombre}`)
    console.log(`   Periodo: ${meso.fecha_inicio} → ${meso.fecha_fin}`)
    console.log(`   Semanas: ${fechas.length} | Judocas: ${judocasMeso.length}`)

    for (const fecha of fechas) {
      // Verificar si ya existe
      const { data: existe } = await sb
        .from('microciclos').select('id')
        .eq('mesociclo_id', meso.id).eq('fecha', fecha).maybeSingle()

      if (existe) { totalSkip++; continue }

      // Crear microciclo
      const { data: micro, error } = await sb
        .from('microciclos')
        .insert([{ mesociclo_id: meso.id, fecha, estado: 'Pendiente' }])
        .select().single()

      if (error) { console.log(`   ✗ ${fecha}: ${error.message}`); continue }

      // Asignar judocas del mesociclo al microciclo
      if (judocasMeso.length > 0) {
        const rows = judocasMeso.map(jid => ({ microciclo_id: micro.id, judoka_id: jid }))
        const { error: errJ } = await sb
          .from('microciclo_judokas')
          .upsert(rows, { onConflict: 'microciclo_id,judoka_id' })
        if (errJ) console.log(`   ⚠ Judocas ${fecha}: ${errJ.message}`)
      }

      totalCreados++
    }
    console.log(`   ✓ ${fechas.length - totalSkip} creados\n`)
  }

  console.log(`\n✅ Total: ${totalCreados} microciclos creados, ${totalSkip} ya existían`)
}

main().catch(console.error)
