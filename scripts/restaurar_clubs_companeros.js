/**
 * Restaura los judokas de compañeros a sus clubs originales.
 * Solo mueve judokas actualmente en "Club para Pruebas" que tienen
 * los nombres especificados, excluyendo los @test.addjc.bo (seed).
 */
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bkieatnermhdmsqxhtih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraWVhdG5lcm1oZG1zcXhodGloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI2NTI1MiwiZXhwIjoyMDgzODQxMjUyfQ.voWBImSfPSlhHE0o-jAgX8XyaNgzhVUIqNf63iOmh54'
)

async function main() {
  // 1. Obtener los IDs de los clubs
  const { data: clubs, error: errClubs } = await supabase
    .from('clubes')
    .select('id, nombre')

  if (errClubs) { console.error('Error clubs:', errClubs); process.exit(1) }

  console.log('\n=== CLUBS EN BD ===')
  clubs.forEach(c => console.log(`  [${c.id}] ${c.nombre}`))

  const clubMap = {}
  clubs.forEach(c => { clubMap[c.nombre] = c.id })

  const idPruebas   = clubMap['Club para Pruebas']
  const idLaPaz     = clubMap['Club Atlético Judo La Paz']
  const idSantaCruz = clubMap['Club Dragón Judo Santa Cruz']
  const idPotosi    = clubMap['Club Samurai Potosí']

  console.log('\nIDs resueltos:')
  console.log('  Club para Pruebas:', idPruebas)
  console.log('  La Paz:', idLaPaz)
  console.log('  Santa Cruz:', idSantaCruz)
  console.log('  Potosí:', idPotosi)

  // 2. Traer TODOS los judokas de "Club para Pruebas" con sus datos de usuario
  const { data: enPruebas, error: errPruebas } = await supabase
    .from('judokas')
    .select('id, club_id, usuarios(id, nombre, apellido_paterno, correo)')
    .eq('club_id', idPruebas)

  if (errPruebas) { console.error('Error:', errPruebas); process.exit(1) }

  console.log(`\n=== JUDOKAS EN CLUB PARA PRUEBAS: ${enPruebas.length} ===`)
  enPruebas.forEach(j => {
    const u = j.usuarios
    console.log(`  [${j.id}] ${u?.nombre} ${u?.apellido_paterno} | ${u?.correo}`)
  })

  // 3. Definir las asignaciones por nombre (excluyendo @test.addjc.bo)
  // La Paz: Marco, Rodrigo, Luis, Sofía, Valeria
  const nombresLaPaz = ['Marco', 'Rodrigo', 'Luis', 'Sofía', 'Sofia', 'Valeria']
  // Santa Cruz: Pablo, Kevin, Javier, Daniela, Carmen, Patricia
  const nombresSantaCruz = ['Pablo', 'Kevin', 'Javier', 'Daniela', 'Carmen', 'Patricia']

  // Separar los NO-seed (excluir @test.addjc.bo)
  const noSeed = enPruebas.filter(j => !j.usuarios?.correo?.endsWith('@test.addjc.bo'))
  console.log(`\nJudokas no-seed en pruebas: ${noSeed.length}`)

  const aLaPaz     = noSeed.filter(j => nombresLaPaz.includes(j.usuarios?.nombre))
  const aSantaCruz = noSeed.filter(j => nombresSantaCruz.includes(j.usuarios?.nombre))

  // Los de Potosí: los que quedan no-seed que no van a La Paz ni Santa Cruz
  const idsAsignados = new Set([...aLaPaz, ...aSantaCruz].map(j => j.id))
  const aPotosi = noSeed.filter(j => !idsAsignados.has(j.id))

  console.log('\n--- A La Paz:', aLaPaz.map(j => j.usuarios?.nombre))
  console.log('--- A Santa Cruz:', aSantaCruz.map(j => j.usuarios?.nombre))
  console.log('--- A Potosí (restantes no-seed):', aPotosi.map(j => j.usuarios?.nombre))

  // 4. Mover a La Paz
  if (aLaPaz.length > 0) {
    const ids = aLaPaz.map(j => j.id)
    const { error } = await supabase
      .from('judokas')
      .update({ club_id: idLaPaz })
      .in('id', ids)
    if (error) { console.error('Error La Paz:', error); process.exit(1) }
    console.log(`\n✓ ${aLaPaz.length} judokas movidos a La Paz`)
  }

  // 5. Mover a Santa Cruz
  if (aSantaCruz.length > 0) {
    const ids = aSantaCruz.map(j => j.id)
    const { error } = await supabase
      .from('judokas')
      .update({ club_id: idSantaCruz })
      .in('id', ids)
    if (error) { console.error('Error Santa Cruz:', error); process.exit(1) }
    console.log(`✓ ${aSantaCruz.length} judokas movidos a Santa Cruz`)
  }

  // 6. Mover a Potosí
  if (aPotosi.length > 0) {
    const ids = aPotosi.map(j => j.id)
    const { error } = await supabase
      .from('judokas')
      .update({ club_id: idPotosi })
      .in('id', ids)
    if (error) { console.error('Error Potosí:', error); process.exit(1) }
    console.log(`✓ ${aPotosi.length} judokas movidos a Potosí`)
  }

  // 7. Verificación final
  console.log('\n=== VERIFICACIÓN FINAL ===')
  for (const [nombre, id] of Object.entries(clubMap)) {
    if (!id) continue
    const { data, error } = await supabase
      .from('judokas')
      .select('id')
      .eq('club_id', id)
    if (!error) console.log(`  ${nombre}: ${data?.length ?? 0} judokas`)
  }
  console.log('\n✅ Listo!')
}

main().catch(console.error)
