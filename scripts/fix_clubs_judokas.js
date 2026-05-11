/**
 * SCRIPT DIAGNOSTICO Y CORRECCION
 * --------------------------------
 * 1. Muestra el estado actual de judokas y sus clubes
 * 2. Redistribuye los judokas a sus clubes originales segun el seed
 *
 * Uso:  node scripts/fix_clubs_judokas.js
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Mapeo correo -> club original (index del seed)
const CORREO_CLUB = {
  'carlos.mamani@test.addjc.bo': 0,
  'diego.fernandez@test.addjc.bo': 0,
  'andres.condori@test.addjc.bo': 0,
  'ana.quispe@test.addjc.bo': 0,
  'maria.condori@test.addjc.bo': 0,

  'marco.quispe@test.addjc.bo': 1,
  'rodrigo.vargas@test.addjc.bo': 1,
  'luis.tito@test.addjc.bo': 1,
  'sofia.flores@test.addjc.bo': 1,
  'valeria.mamani@test.addjc.bo': 1,

  'pablo.huanca@test.addjc.bo': 2,
  'kevin.salcedo@test.addjc.bo': 2,
  'javier.mamani@test.addjc.bo': 2,
  'daniela.huanca@test.addjc.bo': 2,
  'carmen.apaza@test.addjc.bo': 2,
  'patricia.ticona@test.addjc.bo': 2,

  'nicolas.cruz@test.addjc.bo': 3,
  'lucia.flores@test.addjc.bo': 3,
  'sandra.condori@test.addjc.bo': 3,
  'rosa.mamani@test.addjc.bo': 3,
}

const CLUB_NOMBRES = [
  'Club Judo Cochabamba',
  'Club Atletico Judo La Paz',
  'Club Dragon Judo Santa Cruz',
  'Club Samurai Potosi'
]

async function main() {
  console.log('\n=== DIAGNOSTICO DE CLUBES ===\n')

  // 1. Obtener todos los clubes
  const { data: clubes } = await supabase
    .from('clubes')
    .select('id, nombre_club')
    .order('id')

  console.log('Clubes en la BD:')
  clubes.forEach((c, i) => console.log(`  [${i}] ${c.nombre_club} (id: ${c.id})`))

  // 2. Obtener todos los judokas con su usuario y club actual
  const { data: judokas } = await supabase
    .from('judokas')
    .select('id, club_id, usuarios(correo, nombre, apellido_paterno)')
    .order('id')

  console.log(`\nJudokas (${judokas.length} total):`)
  const clubCount = {}
  judokas.forEach(j => {
    const clubNombre = clubes.find(c => c.id === j.club_id)?.nombre_club || 'SIN CLUB'
    clubCount[clubNombre] = (clubCount[clubNombre] || 0) + 1
    console.log(`  ${j.usuarios.nombre} ${j.usuarios.apellido_paterno} (${j.usuarios.correo}) -> ${clubNombre}`)
  })

  console.log('\nDistribucion actual:')
  Object.entries(clubCount).forEach(([club, count]) => {
    console.log(`  ${club}: ${count} judokas`)
  })

  // 3. Verificar sensei
  const { data: sensei } = await supabase
    .from('senseis')
    .select('id, club_id, usuario_id, usuarios(nombre, apellido_paterno, correo)')
    .single()

  if (sensei) {
    const senseiClub = clubes.find(c => c.id === sensei.club_id)?.nombre_club || 'SIN CLUB'
    console.log(`\nSensei: ${sensei.usuarios.nombre} ${sensei.usuarios.apellido_paterno}`)
    console.log(`  correo: ${sensei.usuarios.correo}`)
    console.log(`  usuario_id: ${sensei.usuario_id}`)
    console.log(`  club_id: ${sensei.club_id} (${senseiClub})`)
  }

  // 4. Redistribuir judokas a sus clubes originales
  console.log('\n=== REDISTRIBUYENDO JUDOKAS ===\n')

  let actualizados = 0
  for (const j of judokas) {
    const correo = j.usuarios.correo
    const clubIdx = CORREO_CLUB[correo]
    if (clubIdx === undefined) {
      console.log(`  SKIP: ${correo} (no esta en el mapeo del seed)`)
      continue
    }

    const clubIdOriginal = clubes[clubIdx]?.id
    if (!clubIdOriginal) {
      console.log(`  ERROR: No se encontro club indice ${clubIdx}`)
      continue
    }

    if (j.club_id === clubIdOriginal) {
      console.log(`  OK: ${j.usuarios.nombre} ${j.usuarios.apellido_paterno} ya esta en ${CLUB_NOMBRES[clubIdx]}`)
      continue
    }

    const { error } = await supabase
      .from('judokas')
      .update({ club_id: clubIdOriginal })
      .eq('id', j.id)

    if (error) {
      console.log(`  ERROR: ${j.usuarios.nombre} ${j.usuarios.apellido_paterno}: ${error.message}`)
    } else {
      console.log(`  MOVIDO: ${j.usuarios.nombre} ${j.usuarios.apellido_paterno} -> ${CLUB_NOMBRES[clubIdx]}`)
      actualizados++
    }
  }

  console.log(`\n${actualizados} judokas actualizados.`)

  // 5. Verificar resultado final
  const { data: judokasPost } = await supabase
    .from('judokas')
    .select('id, club_id, usuarios(nombre, apellido_paterno)')
    .order('id')

  console.log('\n=== DISTRIBUCION FINAL ===\n')
  const clubCountPost = {}
  judokasPost.forEach(j => {
    const clubNombre = clubes.find(c => c.id === j.club_id)?.nombre_club || 'SIN CLUB'
    clubCountPost[clubNombre] = (clubCountPost[clubNombre] || 0) + 1
  })
  Object.entries(clubCountPost).forEach(([club, count]) => {
    console.log(`  ${club}: ${count} judokas`)
  })

  console.log('\nEl sensei (Club Judo Cochabamba) ahora deberia ver solo 5 judokas.')
  console.log('Admin/asociacion deberia ver los 20.\n')
}

main().catch(e => { console.error('Error:', e.message); process.exit(1) })
