// ============================================================
// SEED DE DATOS - API Judo ADDJC
// Ejecutar: node seed.js
// ============================================================

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const { calcularTodosVO2 } = require('./src/shared/utils/calculos')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const PASSWORD = '12345678'

// ============================================================
// DEFINICIÓN DE DATOS
// ============================================================

const CLUBS_DEF = [
  { nombre_club: 'Club Leones Cercado',   direccion: 'Av. América 1250, Cercado',        telefono_contacto: '44123456' },
  { nombre_club: 'Club Águilas Cercado',  direccion: 'Calle Sucre 890, Cercado',          telefono_contacto: '44234567' },
  { nombre_club: 'Club Dragones Cercado', direccion: 'Av. Blanco Galindo 340, Cercado',   telefono_contacto: '44345678' }
]

const ADMIN_DEF = {
  correo: 'admin.seed@judo.com', nombre: 'Luis', ap: 'Vargas', am: 'Huanca',
  genero: 'M', ci: '7654321', fn: '1985-03-15', tel: '79123456', rol: 'admin'
}

const SENSEIS_DEF = [
  { correo: 'sensei.leones@judo.com',   nombre: 'Juan',   ap: 'Mamani', am: 'Quispe',   genero: 'M', ci: '8111111', fn: '1982-06-10', tel: '78111111', rol: 'sensei', clubIdx: 0 },
  { correo: 'sensei.aguilas@judo.com',  nombre: 'Carlos', ap: 'Flores', am: 'Villca',   genero: 'M', ci: '8222222', fn: '1980-09-22', tel: '78222222', rol: 'sensei', clubIdx: 1 },
  { correo: 'sensei.dragones@judo.com', nombre: 'Miguel', ap: 'Rojas',  am: 'Condori',  genero: 'M', ci: '8333333', fn: '1978-12-05', tel: '78333333', rol: 'sensei', clubIdx: 2 }
]

const JUDOKAS_DEF = [
  // ── Club Leones (clubIdx 0)
  [
    { correo: 'judoka.leones1@judo.com', nombre: 'Pedro',    ap: 'Mamani',  am: 'Condori', genero: 'M', ci: '9101010', fn: '2005-03-15', tel: '71101010', peso: 73,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.leones2@judo.com', nombre: 'Ana',      ap: 'Flores',  am: 'Quispe',  genero: 'F', ci: '9102020', fn: '2004-07-22', tel: '71102020', peso: 57,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.leones3@judo.com', nombre: 'Diego',    ap: 'Huanca',  am: 'Vargas',  genero: 'M', ci: '9103030', fn: '2003-11-08', tel: '71103030', peso: 81,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.leones4@judo.com', nombre: 'Carla',    ap: 'López',   am: 'Miranda', genero: 'F', ci: '9104040', fn: '2006-01-30', tel: '71104040', peso: 63,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.leones5@judo.com', nombre: 'Rodrigo',  ap: 'Cáceres', am: 'Huanca',  genero: 'M', ci: '9105050', fn: '2002-05-14', tel: '71105050', peso: 66,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.leones6@judo.com', nombre: 'Valeria',  ap: 'Condori', am: 'Lima',    genero: 'F', ci: '9106060', fn: '2005-09-19', tel: '71106060', peso: 52,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.leones7@judo.com', nombre: 'Fernando', ap: 'Quispe',  am: 'Poma',    genero: 'M', ci: '9107070', fn: '2001-12-25', tel: '71107070', peso: 90,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.leones8@judo.com', nombre: 'Lucía',    ap: 'Mamani',  am: 'Torres',  genero: 'F', ci: '9108080', fn: '2004-04-03', tel: '71108080', peso: 48,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' }
  ],
  // ── Club Águilas (clubIdx 1)
  [
    { correo: 'judoka.aguilas1@judo.com', nombre: 'Marco',    ap: 'Villca',  am: 'Flores',  genero: 'M', ci: '9201010', fn: '2004-02-11', tel: '72201010', peso: 60,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.aguilas2@judo.com', nombre: 'Sofía',    ap: 'Rojas',   am: 'Condori', genero: 'F', ci: '9202020', fn: '2005-08-17', tel: '72202020', peso: 52,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.aguilas3@judo.com', nombre: 'Javier',   ap: 'Limachi', am: 'Ticona',  genero: 'M', ci: '9203030', fn: '2002-12-03', tel: '72203030', peso: 73,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.aguilas4@judo.com', nombre: 'Patricia', ap: 'Cruz',    am: 'Mamani',  genero: 'F', ci: '9204040', fn: '2003-05-28', tel: '72204040', peso: 63,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.aguilas5@judo.com', nombre: 'Luis',     ap: 'Apaza',   am: 'Chura',   genero: 'M', ci: '9205050', fn: '2001-09-09', tel: '72205050', peso: 81,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.aguilas6@judo.com', nombre: 'Gabriela', ap: 'Quispe',  am: 'Lima',    genero: 'F', ci: '9206060', fn: '2007-03-14', tel: '72206060', peso: 48,  cat: 'Cadete',  cinturon: 'Blanco', rol: 'judoka' },
    { correo: 'judoka.aguilas7@judo.com', nombre: 'Carlos',   ap: 'Choque',  am: 'Poma',    genero: 'M', ci: '9207070', fn: '2000-07-21', tel: '72207070', peso: 100, cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.aguilas8@judo.com', nombre: 'María',    ap: 'Álvarez', am: 'Tito',    genero: 'F', ci: '9208080', fn: '2005-11-06', tel: '72208080', peso: 57,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' }
  ],
  // ── Club Dragones (clubIdx 2)
  [
    { correo: 'judoka.dragones1@judo.com', nombre: 'Héctor',    ap: 'Rojas',    am: 'Lima',    genero: 'M', ci: '9301010', fn: '2003-06-25', tel: '73301010', peso: 66,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.dragones2@judo.com', nombre: 'Andrea',    ap: 'Mamani',   am: 'Chura',   genero: 'F', ci: '9302020', fn: '2004-10-12', tel: '73302020', peso: 52,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.dragones3@judo.com', nombre: 'Roberto',   ap: 'Condori',  am: 'Apaza',   genero: 'M', ci: '9303030', fn: '2002-01-07', tel: '73303030', peso: 81,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.dragones4@judo.com', nombre: 'Elena',     ap: 'Ticona',   am: 'Cruz',    genero: 'F', ci: '9304040', fn: '2005-05-20', tel: '73304040', peso: 63,  cat: 'Junior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.dragones5@judo.com', nombre: 'Marcos',    ap: 'Flores',   am: 'Quispe',  genero: 'M', ci: '9305050', fn: '2001-08-15', tel: '73305050', peso: 90,  cat: 'Senior',  cinturon: 'Marrón', rol: 'judoka' },
    { correo: 'judoka.dragones6@judo.com', nombre: 'Daniela',   ap: 'Huanca',   am: 'Vargas',  genero: 'F', ci: '9306060', fn: '2003-12-30', tel: '73306060', peso: 57,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.dragones7@judo.com', nombre: 'Alejandro', ap: 'Lima',     am: 'Tito',    genero: 'M', ci: '9307070', fn: '2004-03-18', tel: '73307070', peso: 73,  cat: 'Senior',  cinturon: 'Azul',   rol: 'judoka' },
    { correo: 'judoka.dragones8@judo.com', nombre: 'Camila',    ap: 'Poma',     am: 'Villca',  genero: 'F', ci: '9308080', fn: '2006-07-04', tel: '73308080', peso: 48,  cat: 'Cadete',  cinturon: 'Blanco', rol: 'judoka' }
  ]
]

const EJERCICIOS_DEF = [
  { nombre: 'Press de Banca',               categoria: 'Físico',   tiempo_base: 3,  series_base: 4 },
  { nombre: 'Jalón al Pecho',               categoria: 'Físico',   tiempo_base: 3,  series_base: 4 },
  { nombre: 'Sentadilla con Barra',         categoria: 'Físico',   tiempo_base: 4,  series_base: 4 },
  { nombre: 'Peso Muerto',                  categoria: 'Físico',   tiempo_base: 3,  series_base: 3 },
  { nombre: 'Remo con Barra',               categoria: 'Físico',   tiempo_base: 3,  series_base: 4 },
  { nombre: 'Press Militar',                categoria: 'Físico',   tiempo_base: 3,  series_base: 3 },
  { nombre: 'Barra Fija (Pull-ups)',         categoria: 'Físico',   tiempo_base: 2,  series_base: 4 },
  { nombre: 'Paralelas (Dips)',              categoria: 'Físico',   tiempo_base: 2,  series_base: 4 },
  { nombre: 'Carrera 1500m',                categoria: 'Físico',   tiempo_base: 6,  series_base: 1 },
  { nombre: 'Course Navette',               categoria: 'Físico',   tiempo_base: 10, series_base: 1 },
  { nombre: 'Randori (Combate libre)',       categoria: 'Técnica',  tiempo_base: 5,  series_base: 6 },
  { nombre: 'Uchi Komi (Sin caída)',         categoria: 'Técnica',  tiempo_base: 3,  series_base: 10 },
  { nombre: 'Nage Komi (Con caída)',         categoria: 'Técnica',  tiempo_base: 4,  series_base: 8 },
  { nombre: 'Newaza (Trabajo de suelo)',     categoria: 'Técnica',  tiempo_base: 5,  series_base: 4 },
  { nombre: 'Kakari Geiko (Ataque)',         categoria: 'Técnica',  tiempo_base: 3,  series_base: 6 },
  { nombre: 'Abdominales en plancha',        categoria: 'Físico',   tiempo_base: 1,  series_base: 4 },
  { nombre: 'Puentes cervicales',            categoria: 'Físico',   tiempo_base: 1,  series_base: 3 },
  { nombre: 'Flexiones de brazos',           categoria: 'Físico',   tiempo_base: 2,  series_base: 4 },
  { nombre: 'Carrera interválica 400m',      categoria: 'Físico',   tiempo_base: 8,  series_base: 4 },
  { nombre: 'Plan táctico de competencia',   categoria: 'Táctico',  tiempo_base: 2,  series_base: 1 }
]

// Fechas de macrociclos por año
const MACROS_TPL = [
  { anio: 2023, inicio: '2023-01-09', fin: '2023-12-15' },
  { anio: 2024, inicio: '2024-01-08', fin: '2024-12-14' },
  { anio: 2025, inicio: '2025-01-06', fin: '2025-12-13' }
]

// Mesociclos por año (3 por macrociclo)
const MESOS_TPL = [
  [
    { nombre: 'Preparación General 2023', fase: 'general',        inicio: '2023-01-09', fin: '2023-04-08' },
    { nombre: 'Pre-competitivo 2023',     fase: 'precompetitiva', inicio: '2023-04-09', fin: '2023-08-06' },
    { nombre: 'Competitivo 2023',         fase: 'competitiva',    inicio: '2023-08-07', fin: '2023-12-15' }
  ],
  [
    { nombre: 'Preparación General 2024', fase: 'general',        inicio: '2024-01-08', fin: '2024-04-07' },
    { nombre: 'Pre-competitivo 2024',     fase: 'precompetitiva', inicio: '2024-04-08', fin: '2024-08-05' },
    { nombre: 'Competitivo 2024',         fase: 'competitiva',    inicio: '2024-08-06', fin: '2024-12-14' }
  ],
  [
    { nombre: 'Preparación General 2025', fase: 'general',        inicio: '2025-01-06', fin: '2025-04-05' },
    { nombre: 'Pre-competitivo 2025',     fase: 'precompetitiva', inicio: '2025-04-06', fin: '2025-08-03' },
    { nombre: 'Competitivo 2025',         fase: 'competitiva',    inicio: '2025-08-04', fin: '2025-12-13' }
  ]
]

// 5 sesiones por mesociclo [macroIdx][mesoIdx]
const MICROS_TPL = [
  // 2023
  [
    ['2023-01-16','2023-01-23','2023-02-06','2023-02-20','2023-03-06'],
    ['2023-04-17','2023-05-01','2023-05-15','2023-06-05','2023-06-19'],
    ['2023-08-14','2023-08-28','2023-09-11','2023-10-09','2023-11-06']
  ],
  // 2024
  [
    ['2024-01-15','2024-01-29','2024-02-12','2024-02-26','2024-03-11'],
    ['2024-04-15','2024-04-29','2024-05-13','2024-06-03','2024-06-17'],
    ['2024-08-12','2024-08-26','2024-09-09','2024-10-07','2024-11-04']
  ],
  // 2025
  [
    ['2025-01-13','2025-01-27','2025-02-10','2025-02-24','2025-03-10'],
    ['2025-04-14','2025-04-28','2025-05-12','2025-06-02','2025-06-16'],
    ['2025-08-11','2025-08-25','2025-09-08','2025-10-06','2025-11-03']
  ]
]

// Valores base de tests por género y peso (kg)
function getBaseTest(genero, peso) {
  if (genero === 'M') {
    if (peso <= 60)  return { press: 62,  tiron: 55,  sent: 80,  barra: 10, par: 12, mil500: 328, nav: 11.5 }
    if (peso <= 66)  return { press: 68,  tiron: 62,  sent: 88,  barra: 11, par: 13, mil500: 336, nav: 11.0 }
    if (peso <= 73)  return { press: 76,  tiron: 69,  sent: 97,  barra: 12, par: 14, mil500: 344, nav: 10.5 }
    if (peso <= 81)  return { press: 87,  tiron: 77,  sent: 108, barra: 10, par: 12, mil500: 354, nav: 10.0 }
    if (peso <= 90)  return { press: 96,  tiron: 84,  sent: 118, barra: 9,  par: 11, mil500: 364, nav: 9.5  }
    return               { press: 107, tiron: 93,  sent: 132, barra: 8,  par: 10, mil500: 376, nav: 9.0  }
  } else {
    if (peso <= 48)  return { press: 30, tiron: 26, sent: 45, barra: 4, par: 5, mil500: 418, nav: 8.0 }
    if (peso <= 52)  return { press: 34, tiron: 29, sent: 49, barra: 5, par: 6, mil500: 406, nav: 8.5 }
    if (peso <= 57)  return { press: 38, tiron: 33, sent: 53, barra: 6, par: 7, mil500: 396, nav: 9.0 }
    return               { press: 43, tiron: 37, sent: 59, barra: 7, par: 8, mil500: 386, nav: 9.5 }
  }
}

// Factor de progresión por año y mesociclo [macroIdx][mesoIdx]
const PROGRESION = [
  [1.00, 1.02, 1.04],
  [1.06, 1.08, 1.10],
  [1.12, 1.14, 1.17]
]

// ============================================================
// HELPERS
// ============================================================

function generarTestDatos(judoka, macroIdx, mesoIdx, fechaRegistro, mesocicloId) {
  const base = getBaseTest(judoka.genero, judoka.peso)
  if (!base) return null
  const f = PROGRESION[macroIdx][mesoIdx]

  const raw = {
    judoka_id:      judoka.id,
    mesociclo_id:   mesocicloId,
    fecha_registro: fechaRegistro,
    peso_corporal:  judoka.peso,
    press_1rm:           Math.round(base.press * f),
    press_recorrido:     0.60,
    press_tiempo:        3,
    tiron_1rm:           Math.round(base.tiron * f),
    tiron_recorrido:     0.50,
    tiron_tiempo:        3,
    sentadilla_1rm:      Math.round(base.sent * f),
    sentadilla_recorrido: 0.75,
    sentadilla_tiempo:   4,
    barra_reps:          Math.round(base.barra * f),
    barra_recorrido:     0.40,
    barra_tiempo:        30,
    paralelas_reps:      Math.round(base.par * f),
    paralelas_recorrido: 0.30,
    paralelas_tiempo:    30,
    mil500_segundos:     Math.round(base.mil500 / f),
    navette_palier:      Math.round(base.nav * f * 2) / 2
  }

  return calcularTodosVO2(raw)
}

async function crearUsuarioAuth(datos) {
  // Si el usuario ya existe en la tabla usuarios, lo reutilizamos
  const { data: existente } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo', datos.correo)
    .single()

  if (existente) return existente

  // Si no existe, lo creamos
  const { error } = await supabase.auth.admin.createUser({
    email: datos.correo,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: {
      nombres:          datos.nombre,
      apellido_paterno: datos.ap,
      apellido_materno: datos.am,
      fecha_nacimiento: datos.fn,
      genero:           datos.genero,
      rol:              datos.rol,
      user_type:        datos.rol
    }
  })
  if (error) throw new Error(`Auth error (${datos.correo}): ${error.message}`)

  await sleep(1500) // esperar trigger de Supabase

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo', datos.correo)
    .single()

  if (!usuario) throw new Error(`Trigger no creó usuario para ${datos.correo}`)

  await supabase.from('usuarios')
    .update({ ci: datos.ci, numero_celular: datos.tel })
    .eq('id', usuario.id)

  return usuario
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('🥋 Iniciando seed de datos ADDJC...\n')

  // ── 1. CLUBES
  console.log('📍 Creando clubes...')
  const { data: clubs, error: eClubs } = await supabase.from('clubes').insert(CLUBS_DEF).select()
  if (eClubs) throw new Error('Error clubes: ' + eClubs.message)
  console.log(`   ✅ ${clubs.length} clubes creados\n`)

  // ── 2. ADMIN
  console.log('👤 Creando admin...')
  await crearUsuarioAuth(ADMIN_DEF)
  console.log(`   ✅ ${ADMIN_DEF.correo}\n`)

  // ── 3. SENSEIS
  console.log('🥋 Creando senseis...')
  const senseis = []
  for (const s of SENSEIS_DEF) {
    const usuario = await crearUsuarioAuth(s)
    const { data: senseiRow, error: eS } = await supabase.from('senseis')
      .insert([{ usuario_id: usuario.id, club_id: clubs[s.clubIdx].id }])
      .select().single()
    if (eS) throw new Error('Error sensei: ' + eS.message)
    senseis.push({ ...senseiRow, clubIdx: s.clubIdx })
    console.log(`   ✅ ${s.correo}  →  ${CLUBS_DEF[s.clubIdx].nombre_club}`)
  }

  // Actualizar director técnico del club
  for (const sensei of senseis) {
    await supabase.from('clubes')
      .update({ director_tecnico_id: sensei.id })
      .eq('id', clubs[sensei.clubIdx].id)
  }
  console.log()

  // ── 4. JUDOKAS
  console.log('🥋 Creando 24 judokas (tarda ~40s)...')
  const judokasPorClub = [[], [], []]

  for (let ci = 0; ci < 3; ci++) {
    const sensei = senseis.find(s => s.clubIdx === ci)
    for (const j of JUDOKAS_DEF[ci]) {
      const usuario = await crearUsuarioAuth(j)
      const { data: judokaRow, error: eJ } = await supabase.from('judokas')
        .insert([{
          usuario_id:      usuario.id,
          club_id:         clubs[ci].id,
          entrenador_id:   sensei.id,
          categoria:       j.cat,
          peso_competitivo: j.peso,
          cinturon_actual: j.cinturon,
          activo:          true
        }])
        .select().single()
      if (eJ) throw new Error('Error judoka: ' + eJ.message)
      judokasPorClub[ci].push({ ...judokaRow, peso: j.peso, cat: j.cat, genero: j.genero })
      process.stdout.write('   .')
    }
    console.log(`  Club ${ci + 1} listo (${CLUBS_DEF[ci].nombre_club})`)
  }
  console.log()

  // ── 5. BANCO DE EJERCICIOS
  console.log('📋 Creando banco de ejercicios...')
  const { data: ejercicios, error: eEj } = await supabase.from('banco_ejercicios')
    .insert(EJERCICIOS_DEF.map(e => ({ ...e, activo: true })))
    .select()
  if (eEj) throw new Error('Error ejercicios: ' + eEj.message)
  console.log(`   ✅ ${ejercicios.length} ejercicios creados\n`)

  // ── 6. CICLOS (macrociclo → mesociclo → microciclo + judokas + ejercicios + tests)
  console.log('📅 Creando estructura de ciclos...')

  for (let ci = 0; ci < 3; ci++) {
    const sensei      = senseis.find(s => s.clubIdx === ci)
    const judokasClub = judokasPorClub[ci]
    const club        = clubs[ci]

    for (let macroIdx = 0; macroIdx < 3; macroIdx++) {
      const macroTpl = MACROS_TPL[macroIdx]

      // ── Macrociclo
      const { data: macro, error: eMacro } = await supabase.from('macrociclos')
        .insert([{
          nombre:      `Macrociclo ${macroTpl.anio} - ${club.nombre_club}`,
          fecha_inicio: macroTpl.inicio,
          fecha_fin:    macroTpl.fin,
          sensei_id:    sensei.id,
          activo:       true
        }])
        .select().single()
      if (eMacro) throw new Error('Error macro: ' + eMacro.message)

      // Asignar todos los judokas del club al macrociclo
      await supabase.from('macrociclo_judokas').insert(
        judokasClub.map(j => ({ macrociclo_id: macro.id, judoka_id: j.id, activo: true }))
      )

      for (let mesoIdx = 0; mesoIdx < 3; mesoIdx++) {
        const mesoTpl = MESOS_TPL[macroIdx][mesoIdx]

        // ── Mesociclo
        const { data: meso, error: eMeso } = await supabase.from('mesociclos')
          .insert([{
            macrociclo_id: macro.id,
            nombre:        mesoTpl.nombre,
            fecha_inicio:  mesoTpl.inicio,
            fecha_fin:     mesoTpl.fin,
            fase:          mesoTpl.fase
          }])
          .select().single()
        if (eMeso) throw new Error('Error meso: ' + eMeso.message)

        // Asignar judokas al mesociclo
        await supabase.from('mesociclo_judokas').insert(
          judokasClub.map(j => ({ mesociclo_id: meso.id, judoka_id: j.id }))
        )

        // ── Tests físicos (uno por judoka, al final del mesociclo)
        const testsData = judokasClub
          .map(j => generarTestDatos(j, macroIdx, mesoIdx, mesoTpl.fin, meso.id))
          .filter(Boolean)
        if (testsData.length > 0) {
          const { error: eTest } = await supabase.from('tests_fisicos').insert(testsData)
          if (eTest) throw new Error('Error tests: ' + eTest.message)
        }

        // ── Microciclos (2 por mesociclo)
        const microFechas = MICROS_TPL[macroIdx][mesoIdx]
        // Rotar ejercicios por combinación macro+meso para dar variedad
        const ejBase = (macroIdx * 3 + mesoIdx) % 17
        const tresEjercicios = [ejercicios[ejBase], ejercicios[ejBase + 1], ejercicios[ejBase + 2]]

        for (const fecha of microFechas) {
          // Crear microciclo
          const { data: micro, error: eMicro } = await supabase.from('microciclos')
            .insert([{
              mesociclo_id:       meso.id,
              fecha:              fecha,
              estado:             'Completado',
              calificacion_sensei: 4
            }])
            .select().single()
          if (eMicro) throw new Error('Error micro: ' + eMicro.message)

          // Variar cuántos judokas se asignan (5, 6, 7 u 8)
          const cantidades = [8, 6, 5, 7, 8, 5, 6, 7, 8, 6]
          const microFechaIdx = microFechas.indexOf(fecha)
          const cantJudokas = cantidades[(macroIdx * 3 + mesoIdx + microFechaIdx) % cantidades.length]
          const judokasMicro = judokasClub.slice(0, cantJudokas)

          // Asignar judokas al microciclo
          await supabase.from('microciclo_judokas').insert(
            judokasMicro.map(j => ({ microciclo_id: micro.id, judoka_id: j.id }))
          )

          // Asignar 3 ejercicios al microciclo
          for (let orden = 0; orden < tresEjercicios.length; orden++) {
            const ej = tresEjercicios[orden]
            const { data: microEj, error: eME } = await supabase.from('microciclo_ejercicios')
              .insert([{
                microciclo_id:      micro.id,
                ejercicio_id:       ej.id,
                tiempo_modificado:  ej.tiempo_base,
                series_modificadas: ej.series_base,
                orden:              orden + 1
              }])
              .select().single()
            if (eME) throw new Error('Error microEj: ' + eME.message)

            // Asignar los mismos judokas variables a cada ejercicio
            await supabase.from('microciclo_ejercicio_judokas').insert(
              judokasMicro.map(j => ({ microciclo_ejercicio_id: microEj.id, judoka_id: j.id }))
            )
          }
        }
      }

      console.log(`   ✅ ${club.nombre_club} — Macrociclo ${macroTpl.anio}`)
    }
  }

  // ── RESUMEN FINAL
  console.log('\n🎉 ¡SEED COMPLETADO!\n')
  console.log('══════════════════════════════════════════════════')
  console.log('  CREDENCIALES — contraseña de todos: 12345678')
  console.log('══════════════════════════════════════════════════')
  console.log('\n👤 ADMIN:')
  console.log(`  ${ADMIN_DEF.correo}`)
  console.log('\n🥋 SENSEIS:')
  SENSEIS_DEF.forEach(s => console.log(`  ${s.correo.padEnd(30)} ${CLUBS_DEF[s.clubIdx].nombre_club}`))
  console.log('\n🥋 JUDOKAS — Club Leones Cercado:')
  JUDOKAS_DEF[0].forEach(j => console.log(`  ${j.correo}`))
  console.log('\n🥋 JUDOKAS — Club Águilas Cercado:')
  JUDOKAS_DEF[1].forEach(j => console.log(`  ${j.correo}`))
  console.log('\n🥋 JUDOKAS — Club Dragones Cercado:')
  JUDOKAS_DEF[2].forEach(j => console.log(`  ${j.correo}`))
  console.log('\n══════════════════════════════════════════════════')
  console.log('  Datos creados:')
  console.log('  • 3 clubes')
  console.log('  • 1 admin + 3 senseis + 24 judokas')
  console.log('  • 20 ejercicios')
  console.log('  • 9 macrociclos (3 por club × 3 años)')
  console.log('  • 27 mesociclos (3 por macrociclo)')
  console.log('  • 54 microciclos (2 por mesociclo)')
  console.log('  • 216 tests físicos con VO2 calculado')
  console.log('══════════════════════════════════════════════════\n')
}

main().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
