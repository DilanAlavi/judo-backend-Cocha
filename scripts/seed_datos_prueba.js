/**
 * SEED DE DATOS DE PRUEBA — ADDJC
 * --------------------------------
 * Crea:
 *   1 sensei (Juan Ramón Gutiérrez)
 *   4 clubes reales
 *   20 judokas con nombres bolivianos reales
 *   1 macrociclo  →  3 mesociclos
 *   Tests físicos completos con evolución progresiva por mesociclo
 *
 * Uso:  node scripts/seed_datos_prueba.js
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ─────────────────────────────────────────────
// UTILIDADES VO2 (idénticas a calculos.js)
// ─────────────────────────────────────────────
function calcVO2Fuerza(carga, recorrido, tiempo, peso) {
  if (!carga || !recorrido || !tiempo || !peso || tiempo <= 0 || peso <= 0) return null
  return Math.round((1.8 * carga * recorrido) / (peso * (tiempo / 60)) * 100) / 100
}
function calcVO2Reps(reps, recorrido, tiempo, peso) {
  if (!reps || !recorrido || !tiempo || !peso || tiempo <= 0) return null
  return Math.round((1.8 * reps * recorrido) / (tiempo / 60) * 100) / 100
}
function calcVO2Mil500(seg) {
  if (!seg || seg <= 0) return null
  const vel_m_min = 1500 / (seg / 60)
  return {
    vo2: Math.round((3.5 + 0.2 * vel_m_min) * 100) / 100,
    velocidad_kmh: Math.round(vel_m_min * 60 / 1000 * 100) / 100
  }
}
function calcVO2Navette(palier) {
  if (!palier || palier <= 0) return null
  const vel = 8 + palier * 0.5
  return {
    vo2: Math.round((5.857 * vel - 19.458) * 100) / 100,
    velocidad_kmh: vel
  }
}

// ─────────────────────────────────────────────
// DATOS BASE
// ─────────────────────────────────────────────

const CLUBES = [
  { nombre_club: 'Club Judo Cochabamba',         direccion: 'Av. Heroínas 450, Cochabamba',      telefono_contacto: '72345678' },
  { nombre_club: 'Club Atlético Judo La Paz',    direccion: 'Calle Illampu 320, La Paz',          telefono_contacto: '71234567' },
  { nombre_club: 'Club Dragón Judo Santa Cruz',  direccion: 'Av. Cañoto 180, Santa Cruz',         telefono_contacto: '73456789' },
  { nombre_club: 'Club Samurai Potosí',           direccion: 'Calle Junín 55, Potosí',             telefono_contacto: '74567890' }
]

const SENSEI = {
  nombre: 'Juan Ramón',
  apellido_paterno: 'Gutiérrez',
  apellido_materno: 'López',
  correo: 'jr.gutierrez@addjc.bo',
  password: '123456789',
  ci: '4521876',
  genero: 'M',
  fecha_nacimiento: '1978-03-15',
  telefono: '71122334',
  rol: 'sensei'
}

// 20 judokas: 10 masculino, 10 femenino
// Cada uno tiene peso, y datos base para los 7 tests (se escalan por mesociclo)
const JUDOKAS_BASE = [
  // --- MASCULINOS ---
  { nombre: 'Carlos',    ap: 'Mamani',     am: 'Quispe',     correo: 'carlos.mamani@test.addjc.bo',    ci: '7845123', genero: 'M', nacimiento: '2001-04-10', tel: '71001001', peso: 75,
    press: [70,1.1,0.40], tiron: [80,1.0,0.45], sent: [95,1.3,0.60], barra: [12,22,0.35], paral: [14,28,0.30], mil500: 390, nav: 10.5, club: 0 },

  { nombre: 'Diego',     ap: 'Fernández',  am: 'Rojas',      correo: 'diego.fernandez@test.addjc.bo',  ci: '6712345', genero: 'M', nacimiento: '2002-07-22', tel: '71002002', peso: 68,
    press: [62,1.1,0.39], tiron: [73,1.0,0.44], sent: [85,1.2,0.58], barra: [10,20,0.35], paral: [11,24,0.30], mil500: 420, nav: 9.0, club: 0 },

  { nombre: 'Andrés',    ap: 'Condori',    am: 'Mamani',     correo: 'andres.condori@test.addjc.bo',   ci: '8956234', genero: 'M', nacimiento: '2000-11-05', tel: '71003003', peso: 81,
    press: [75,1.2,0.41], tiron: [88,1.1,0.46], sent: [100,1.4,0.62], barra: [13,24,0.36], paral: [15,30,0.31], mil500: 370, nav: 11.0, club: 0 },

  { nombre: 'Marco',     ap: 'Quispe',     am: 'Flores',     correo: 'marco.quispe@test.addjc.bo',     ci: '5634712', genero: 'M', nacimiento: '2003-02-18', tel: '71004004', peso: 73,
    press: [65,1.1,0.40], tiron: [76,1.0,0.44], sent: [90,1.3,0.60], barra: [11,21,0.35], paral: [13,26,0.30], mil500: 405, nav: 9.5, club: 1 },

  { nombre: 'Rodrigo',   ap: 'Vargas',     am: 'Mendoza',    correo: 'rodrigo.vargas@test.addjc.bo',   ci: '9123456', genero: 'M', nacimiento: '1999-08-30', tel: '71005005', peso: 90,
    press: [88,1.2,0.42], tiron: [100,1.1,0.48], sent: [115,1.5,0.63], barra: [14,26,0.36], paral: [16,32,0.31], mil500: 355, nav: 12.0, club: 1 },

  { nombre: 'Luis',      ap: 'Tito',       am: 'Chura',      correo: 'luis.tito@test.addjc.bo',        ci: '4823156', genero: 'M', nacimiento: '2002-05-12', tel: '71006006', peso: 66,
    press: [58,1.0,0.38], tiron: [68,0.9,0.43], sent: [80,1.2,0.57], barra: [9,19,0.34], paral: [10,22,0.29], mil500: 435, nav: 8.5, club: 1 },

  { nombre: 'Pablo',     ap: 'Huanca',     am: 'Apaza',      correo: 'pablo.huanca@test.addjc.bo',     ci: '3712845', genero: 'M', nacimiento: '2001-09-28', tel: '71007007', peso: 78,
    press: [72,1.1,0.41], tiron: [84,1.0,0.46], sent: [98,1.3,0.61], barra: [12,23,0.35], paral: [14,29,0.30], mil500: 380, nav: 10.0, club: 2 },

  { nombre: 'Kevin',     ap: 'Salcedo',    am: 'Castro',     correo: 'kevin.salcedo@test.addjc.bo',    ci: '6234987', genero: 'M', nacimiento: '2003-01-07', tel: '71008008', peso: 84,
    press: [80,1.2,0.42], tiron: [92,1.1,0.47], sent: [108,1.4,0.62], barra: [13,25,0.36], paral: [15,31,0.31], mil500: 365, nav: 11.5, club: 2 },

  { nombre: 'Javier',    ap: 'Mamani',     am: 'Colque',     correo: 'javier.mamani@test.addjc.bo',    ci: '7435612', genero: 'M', nacimiento: '2000-06-19', tel: '71009009', peso: 71,
    press: [64,1.1,0.40], tiron: [74,1.0,0.44], sent: [88,1.2,0.59], barra: [10,20,0.35], paral: [12,25,0.30], mil500: 410, nav: 9.0, club: 2 },

  { nombre: 'Nicolás',   ap: 'Cruz',       am: 'Velásquez',  correo: 'nicolas.cruz@test.addjc.bo',     ci: '8901234', genero: 'M', nacimiento: '1998-12-03', tel: '71010010', peso: 95,
    press: [92,1.3,0.43], tiron: [105,1.2,0.49], sent: [125,1.5,0.65], barra: [15,28,0.37], paral: [17,34,0.32], mil500: 345, nav: 12.5, club: 3 },

  // --- FEMENINAS ---
  { nombre: 'Ana',       ap: 'Quispe',     am: 'Mamani',     correo: 'ana.quispe@test.addjc.bo',       ci: '5612378', genero: 'F', nacimiento: '2002-03-14', tel: '72001001', peso: 57,
    press: [42,1.0,0.37], tiron: [50,0.9,0.42], sent: [62,1.1,0.55], barra: [8,18,0.33], paral: [9,20,0.28], mil500: 450, nav: 8.0, club: 0 },

  { nombre: 'María',     ap: 'Condori',    am: 'López',      correo: 'maria.condori@test.addjc.bo',    ci: '4523189', genero: 'F', nacimiento: '2001-07-25', tel: '72002002', peso: 63,
    press: [48,1.0,0.38], tiron: [56,0.9,0.43], sent: [70,1.2,0.57], barra: [9,20,0.34], paral: [10,22,0.29], mil500: 430, nav: 8.5, club: 0 },

  { nombre: 'Sofía',     ap: 'Flores',     am: 'Ticona',     correo: 'sofia.flores@test.addjc.bo',     ci: '6789012', genero: 'F', nacimiento: '2003-10-08', tel: '72003003', peso: 52,
    press: [38,0.9,0.36], tiron: [45,0.8,0.41], sent: [56,1.0,0.53], barra: [7,16,0.32], paral: [8,18,0.27], mil500: 470, nav: 7.5, club: 1 },

  { nombre: 'Valeria',   ap: 'Mamani',     am: 'Chura',      correo: 'valeria.mamani@test.addjc.bo',   ci: '7890123', genero: 'F', nacimiento: '2000-05-17', tel: '72004004', peso: 68,
    press: [52,1.1,0.39], tiron: [60,1.0,0.44], sent: [75,1.2,0.58], barra: [10,21,0.34], paral: [11,23,0.29], mil500: 415, nav: 9.0, club: 1 },

  { nombre: 'Daniela',   ap: 'Huanca',     am: 'Ríos',       correo: 'daniela.huanca@test.addjc.bo',   ci: '3456789', genero: 'F', nacimiento: '2002-01-30', tel: '72005005', peso: 58,
    press: [44,1.0,0.37], tiron: [52,0.9,0.42], sent: [65,1.1,0.55], barra: [8,18,0.33], paral: [9,20,0.28], mil500: 445, nav: 8.0, club: 2 },

  { nombre: 'Carmen',    ap: 'Apaza',      am: 'Calizaya',   correo: 'carmen.apaza@test.addjc.bo',     ci: '2345678', genero: 'F', nacimiento: '1999-09-11', tel: '72006006', peso: 61,
    press: [46,1.0,0.38], tiron: [54,0.9,0.43], sent: [68,1.1,0.56], barra: [9,19,0.33], paral: [10,21,0.29], mil500: 438, nav: 8.5, club: 2 },

  { nombre: 'Patricia',  ap: 'Ticona',     am: 'Mamani',     correo: 'patricia.ticona@test.addjc.bo',  ci: '1234567', genero: 'F', nacimiento: '2003-06-04', tel: '72007007', peso: 55,
    press: [40,0.9,0.37], tiron: [47,0.8,0.42], sent: [60,1.0,0.54], barra: [7,17,0.32], paral: [8,19,0.28], mil500: 460, nav: 7.5, club: 2 },

  { nombre: 'Lucía',     ap: 'Flores',     am: 'Mendoza',    correo: 'lucia.flores@test.addjc.bo',     ci: '9012345', genero: 'F', nacimiento: '2001-12-20', tel: '72008008', peso: 64,
    press: [50,1.0,0.38], tiron: [58,0.9,0.43], sent: [72,1.2,0.57], barra: [9,20,0.34], paral: [10,22,0.29], mil500: 425, nav: 8.5, club: 3 },

  { nombre: 'Sandra',    ap: 'Condori',    am: 'Quispe',     correo: 'sandra.condori@test.addjc.bo',   ci: '8123456', genero: 'F', nacimiento: '2000-08-13', tel: '72009009', peso: 59,
    press: [45,1.0,0.37], tiron: [53,0.9,0.42], sent: [66,1.1,0.55], barra: [8,18,0.33], paral: [9,20,0.28], mil500: 442, nav: 8.0, club: 3 },

  { nombre: 'Rosa',      ap: 'Mamani',     am: 'Tito',       correo: 'rosa.mamani@test.addjc.bo',      ci: '7234561', genero: 'F', nacimiento: '1998-04-26', tel: '72010010', peso: 70,
    press: [54,1.1,0.39], tiron: [62,1.0,0.44], sent: [78,1.2,0.58], barra: [10,21,0.34], paral: [11,24,0.29], mil500: 410, nav: 9.0, club: 3 }
]

// Factores de mejora por mesociclo (factor > 1 = mejora)
// Para 1500m: el tiempo BAJA (1/factor), para el resto SUBE
const FACTORES = [1.0, 1.08, 1.15]

function generarTest(j, factorIdx, peso, judokaId, mesocicloId, fecha) {
  const f = FACTORES[factorIdx]
  const [press_1rm, press_tiempo, press_recorrido] = j.press
  const [tiron_1rm, tiron_tiempo, tiron_recorrido] = j.tiron
  const [sent_1rm, sent_tiempo, sent_recorrido] = j.sent
  const [barra_reps, barra_tiempo, barra_recorrido] = j.barra
  const [paral_reps, paral_tiempo, paral_recorrido] = j.paral

  const p1rm   = Math.round(press_1rm * f)
  const t1rm   = Math.round(tiron_1rm * f)
  const s1rm   = Math.round(sent_1rm * f)
  const breps  = Math.round(barra_reps * f)
  const preps  = Math.round(paral_reps * f)
  const mil500 = Math.round(j.mil500 / f)       // Tiempo baja = mejora
  const nav    = Math.round(j.nav * f * 2) / 2  // Navette sube, múltiplos de 0.5

  const press_vo2      = calcVO2Fuerza(p1rm, press_recorrido, press_tiempo, peso)
  const tiron_vo2      = calcVO2Fuerza(t1rm, tiron_recorrido, tiron_tiempo, peso)
  const sentadilla_vo2 = calcVO2Fuerza(s1rm, sent_recorrido, sent_tiempo, peso)
  const barra_vo2      = calcVO2Reps(breps, barra_recorrido, barra_tiempo, peso)
  const paralelas_vo2  = calcVO2Reps(preps, paral_recorrido, paral_tiempo, peso)
  const r1500 = calcVO2Mil500(mil500)
  const rNav  = calcVO2Navette(nav)

  return {
    judoka_id: judokaId,
    mesociclo_id: mesocicloId,
    fecha_registro: fecha,
    peso_corporal: peso,

    press_1rm: p1rm, press_tiempo, press_recorrido, press_vo2,
    tiron_1rm: t1rm, tiron_tiempo, tiron_recorrido, tiron_vo2,
    sentadilla_1rm: s1rm, sentadilla_tiempo: sent_tiempo, sentadilla_recorrido: sent_recorrido, sentadilla_vo2,
    barra_reps: breps, barra_tiempo, barra_recorrido, barra_vo2,
    paralelas_reps: preps, paralelas_tiempo: paral_tiempo, paralelas_recorrido: paral_recorrido, paralelas_vo2,
    mil500_segundos: mil500, mil500_velocidad: r1500?.velocidad_kmh ?? null, mil500_vo2: r1500?.vo2 ?? null,
    navette_palier: nav, navette_velocidad: rNav?.velocidad_kmh ?? null, navette_vo2: rNav?.vo2 ?? null
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function ok(label) { console.log(`  ✓ ${label}`) }
function err(label, e) { console.error(`  ✗ ${label}:`, e?.message || e); process.exit(1) }
async function esperar(ms) { return new Promise(r => setTimeout(r, ms)) }

async function crearAuthUser({ correo, password, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, genero, rol }) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: correo, password,
    email_confirm: true,
    user_metadata: { nombres: nombre, apellido_paterno, apellido_materno, fecha_nacimiento, genero, rol, user_type: rol }
  })
  if (error) throw new Error(`createUser ${correo}: ${error.message}`)
  return data.user.id
}

async function getUsuarioId(correo) {
  const { data, error } = await supabase.from('usuarios').select('id').eq('correo', correo).single()
  if (error || !data) throw new Error(`getUsuarioId ${correo}: ${error?.message}`)
  return data.id
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║   SEED DATOS PRUEBA — ADDJC Judo             ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  // ── 1. CLUBES ──────────────────────────────
  console.log('▶ Creando clubes...')
  const { data: clubesCreados, error: eClub } = await supabase.from('clubes').insert(CLUBES).select()
  if (eClub) err('clubes', eClub)
  const clubIds = clubesCreados.map(c => c.id)
  ok(`${clubesCreados.length} clubes: ${clubesCreados.map(c => c.nombre_club).join(', ')}`)

  // ── 2. SENSEI ──────────────────────────────
  console.log('\n▶ Creando sensei...')
  const senseiAuthId = await crearAuthUser(SENSEI)
  await esperar(2000) // esperar trigger
  const senseiUserId = await getUsuarioId(SENSEI.correo)
  await supabase.from('usuarios').update({ ci: SENSEI.ci, numero_celular: SENSEI.telefono }).eq('id', senseiUserId)
  const { data: senseiReg, error: eSenseiReg } = await supabase.from('senseis')
    .insert([{ usuario_id: senseiUserId, club_id: clubIds[0] }])
    .select().single()
  if (eSenseiReg) err('senseis', eSenseiReg)
  await supabase.from('clubes').update({ director_tecnico_id: senseiReg.id }).eq('id', clubIds[0])
  ok(`Sensei Juan Ramón Gutiérrez → Club Judo Cochabamba (usuario_id: ${senseiUserId})`)

  // ── 3. JUDOKAS (20) ────────────────────────
  console.log('\n▶ Creando 20 judokas...')
  const judokaIds = []  // IDs de la tabla judokas

  for (let i = 0; i < JUDOKAS_BASE.length; i++) {
    const j = JUDOKAS_BASE[i]
    process.stdout.write(`  Creando ${j.nombre} ${j.ap}...`)
    try {
      await crearAuthUser({ ...j, apellido_paterno: j.ap, apellido_materno: j.am, fecha_nacimiento: j.nacimiento, rol: 'judoka' })
      await esperar(1800)
      const usuarioId = await getUsuarioId(j.correo)
      await supabase.from('usuarios').update({ ci: j.ci, numero_celular: j.tel }).eq('id', usuarioId)
      const { data: judokaReg, error: eJ } = await supabase.from('judokas')
        .insert([{ usuario_id: usuarioId, club_id: clubIds[j.club], peso_competitivo: j.peso, cinturon_actual: null }])
        .select().single()
      if (eJ) throw new Error(eJ.message)
      judokaIds.push(judokaReg.id)
      console.log(` ✓ (id: ${judokaReg.id})`)
    } catch (e) {
      console.log(` ✗ ERROR: ${e.message}`)
      process.exit(1)
    }
  }
  ok(`${judokaIds.length} judokas registrados`)

  // ── 4. MACROCICLO ──────────────────────────
  console.log('\n▶ Creando macrociclo...')
  const { data: macro, error: eMacro } = await supabase.from('macrociclos')
    .insert([{
      nombre: 'Preparación Campeonato Nacional 2025',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-11-30',
      sensei_id: senseiReg.id,
      activo: true
    }]).select().single()
  if (eMacro) err('macrociclo', eMacro)
  ok(`Macrociclo: "${macro.nombre}" (id: ${macro.id})`)

  // ── 5. MESOCICLOS (3) ──────────────────────
  console.log('\n▶ Creando mesociclos...')
  const MESOS_DEF = [
    { nombre: 'Fase Preparatoria General',   fecha_inicio: '2025-01-15', fecha_fin: '2025-03-31', fase: 'preparacion_general',   fecha_test: '2025-03-20' },
    { nombre: 'Fase Preparatoria Específica', fecha_inicio: '2025-04-01', fecha_fin: '2025-07-15', fase: 'preparacion_especifica', fecha_test: '2025-07-05' },
    { nombre: 'Fase Competitiva',             fecha_inicio: '2025-07-20', fecha_fin: '2025-10-31', fase: 'competencia',            fecha_test: '2025-10-15' }
  ]
  const mesoIds = []
  const mesoFechas = []
  for (const def of MESOS_DEF) {
    const { data: meso, error: eM } = await supabase.from('mesociclos')
      .insert([{ macrociclo_id: macro.id, nombre: def.nombre, fecha_inicio: def.fecha_inicio, fecha_fin: def.fecha_fin, fase: def.fase }])
      .select().single()
    if (eM) err(`mesociclo ${def.nombre}`, eM)
    mesoIds.push(meso.id)
    mesoFechas.push(def.fecha_test)
    ok(`${def.nombre} (${def.fecha_inicio} → ${def.fecha_fin})`)
  }

  // ── 6. ASIGNAR JUDOKAS A MACROCICLO ────────
  console.log('\n▶ Asignando judokas al macrociclo...')
  const macroJudokaRows = judokaIds.map(jid => ({ macrociclo_id: macro.id, judoka_id: jid, activo: true }))
  const { error: eMJ } = await supabase.from('macrociclo_judokas').insert(macroJudokaRows)
  if (eMJ) err('macrociclo_judokas', eMJ)
  ok(`${judokaIds.length} judokas asignados al macrociclo`)

  // ── 7. ASIGNAR JUDOKAS A MESOCICLOS ────────
  // Meso 0 (Prep General):    judokas 0-14  (15 judokas)
  // Meso 1 (Prep Específica): judokas 0-14  (mismos, muestran evolución)
  // Meso 2 (Competitiva):     todos 0-19   (20 judokas, pico de forma)
  console.log('\n▶ Asignando judokas a mesociclos...')
  const asignaciones = [
    { mesoIdx: 0, judokaIdxs: Array.from({length: 15}, (_, i) => i) },
    { mesoIdx: 1, judokaIdxs: Array.from({length: 15}, (_, i) => i) },
    { mesoIdx: 2, judokaIdxs: Array.from({length: 20}, (_, i) => i) }
  ]

  for (const a of asignaciones) {
    const rows = a.judokaIdxs.map(i => ({ mesociclo_id: mesoIds[a.mesoIdx], judoka_id: judokaIds[i] }))
    const { error: eMesJ } = await supabase.from('mesociclo_judokas').insert(rows)
    if (eMesJ) err(`mesociclo_judokas meso ${a.mesoIdx}`, eMesJ)
    ok(`Mesociclo "${MESOS_DEF[a.mesoIdx].nombre}": ${rows.length} judokas asignados`)
  }

  // ── 8. TESTS FÍSICOS ───────────────────────
  console.log('\n▶ Insertando tests físicos...')
  let totalTests = 0
  for (const a of asignaciones) {
    const tests = a.judokaIdxs.map(i => {
      const j = JUDOKAS_BASE[i]
      return generarTest(j, a.mesoIdx, j.peso, judokaIds[i], mesoIds[a.mesoIdx], mesoFechas[a.mesoIdx])
    })
    const { error: eT } = await supabase.from('tests_fisicos').insert(tests)
    if (eT) err(`tests meso ${a.mesoIdx}`, eT)
    totalTests += tests.length
    ok(`${tests.length} tests → "${MESOS_DEF[a.mesoIdx].nombre}"`)
  }

  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║   SEED COMPLETADO EXITOSAMENTE               ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log(`
  Resumen:
    • 4 clubes creados
    • 1 sensei: jr.gutierrez@addjc.bo / 123456789
    • 20 judokas: [nombre].apellido@test.addjc.bo / 123456789
    • 1 macrociclo con 3 mesociclos
    • ${totalTests} tests físicos completos (con evolución progresiva)

  Inicia sesión como sensei para ver las gráficas VO2.
`)
}

main().catch(e => { console.error('\n✗ Error fatal:', e.message); process.exit(1) })
