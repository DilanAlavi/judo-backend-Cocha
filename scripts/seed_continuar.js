/**
 * SEED — CONTINUACIÓN (mesociclos, asignaciones, tests)
 * Los clubes, sensei, judokas y macrociclo ya fueron creados.
 * Este script crea lo que faltó: mesociclos, asignaciones y tests.
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// ─── IDs creados por seed_datos_prueba.js ─────────────────────
const MACRO_ID = '26a7f383-e9e5-4026-87dc-0b57441d12f8'

// Orden exacto de creación (mismo orden del array JUDOKAS_BASE)
const JUDOKA_IDS = [
  'bae3e7be-d85b-40fc-8c36-d5cb320671b7', // 0  Carlos Mamani   M 75kg
  '8df2796c-eede-433c-911a-6eb69e120222', // 1  Diego Fernández M 68kg
  'b05e5c78-1574-427f-84be-1a17513cc404', // 2  Andrés Condori  M 81kg
  '25f0842c-1dbc-4a2c-bc7b-99ad74b2da3a', // 3  Marco Quispe    M 73kg
  'ac10d4e8-47ec-4ea9-976b-aafe3a6074c9', // 4  Rodrigo Vargas  M 90kg
  'd73605b4-ff41-45ee-9d74-80f9bf9452cb', // 5  Luis Tito       M 66kg
  '16e762ad-be75-45df-afee-6db00fc3eec6', // 6  Pablo Huanca    M 78kg
  '5c65bae8-e1e6-4fef-809b-de18db80c45e', // 7  Kevin Salcedo   M 84kg
  '0c5ad511-0385-44fa-a812-fa975c1a7ff1', // 8  Javier Mamani   M 71kg
  '95d6f500-8d3a-4ee3-a440-1c2767378581', // 9  Nicolás Cruz    M 95kg
  '967205a5-e7f8-4a95-95d9-9a6ce5d254c6', // 10 Ana Quispe      F 57kg
  '93f6d4d8-be2e-43f2-88f5-67790994ded3', // 11 María Condori   F 63kg
  '1586b4fb-bb05-4c8c-99e1-8775fbe9b55e', // 12 Sofía Flores    F 52kg
  '958c6c6b-04dd-4bad-8c7f-ba24209c118d', // 13 Valeria Mamani  F 68kg
  'c0b2ceef-46c8-4b48-908b-b9c90fb53534', // 14 Daniela Huanca  F 58kg
  '64a75a01-1c92-479b-82b9-900c2dcbeaad', // 15 Carmen Apaza    F 61kg
  'b3c87810-0e10-405d-8ea9-139937c247a4', // 16 Patricia Ticona F 55kg
  'f4ccbb97-6f09-41f1-8bd9-7dcfe59c27d8', // 17 Lucía Flores    F 64kg
  'f20c3a95-0d11-4145-bbf8-026ceab83344', // 18 Sandra Condori  F 59kg
  '0f0088e6-5666-4887-a750-6d778c9890c6', // 19 Rosa Mamani     F 70kg
]

// Datos base por judoka (mismo orden que JUDOKA_IDS)
// [press_1rm, press_t, press_rec] [tiron_1rm,t,rec] [sent_1rm,t,rec] [barra_reps,t,rec] [par_reps,t,rec] mil500 navette peso
const BASE = [
  { press:[70,1.1,0.40], tiron:[80,1.0,0.45], sent:[95,1.3,0.60], barra:[12,22,0.35], par:[14,28,0.30], m:390, n:10.5, p:75 },
  { press:[62,1.1,0.39], tiron:[73,1.0,0.44], sent:[85,1.2,0.58], barra:[10,20,0.35], par:[11,24,0.30], m:420, n:9.0, p:68 },
  { press:[75,1.2,0.41], tiron:[88,1.1,0.46], sent:[100,1.4,0.62], barra:[13,24,0.36], par:[15,30,0.31], m:370, n:11.0, p:81 },
  { press:[65,1.1,0.40], tiron:[76,1.0,0.44], sent:[90,1.3,0.60], barra:[11,21,0.35], par:[13,26,0.30], m:405, n:9.5, p:73 },
  { press:[88,1.2,0.42], tiron:[100,1.1,0.48], sent:[115,1.5,0.63], barra:[14,26,0.36], par:[16,32,0.31], m:355, n:12.0, p:90 },
  { press:[58,1.0,0.38], tiron:[68,0.9,0.43], sent:[80,1.2,0.57], barra:[9,19,0.34], par:[10,22,0.29], m:435, n:8.5, p:66 },
  { press:[72,1.1,0.41], tiron:[84,1.0,0.46], sent:[98,1.3,0.61], barra:[12,23,0.35], par:[14,29,0.30], m:380, n:10.0, p:78 },
  { press:[80,1.2,0.42], tiron:[92,1.1,0.47], sent:[108,1.4,0.62], barra:[13,25,0.36], par:[15,31,0.31], m:365, n:11.5, p:84 },
  { press:[64,1.1,0.40], tiron:[74,1.0,0.44], sent:[88,1.2,0.59], barra:[10,20,0.35], par:[12,25,0.30], m:410, n:9.0, p:71 },
  { press:[92,1.3,0.43], tiron:[105,1.2,0.49], sent:[125,1.5,0.65], barra:[15,28,0.37], par:[17,34,0.32], m:345, n:12.5, p:95 },
  { press:[42,1.0,0.37], tiron:[50,0.9,0.42], sent:[62,1.1,0.55], barra:[8,18,0.33], par:[9,20,0.28], m:450, n:8.0, p:57 },
  { press:[48,1.0,0.38], tiron:[56,0.9,0.43], sent:[70,1.2,0.57], barra:[9,20,0.34], par:[10,22,0.29], m:430, n:8.5, p:63 },
  { press:[38,0.9,0.36], tiron:[45,0.8,0.41], sent:[56,1.0,0.53], barra:[7,16,0.32], par:[8,18,0.27], m:470, n:7.5, p:52 },
  { press:[52,1.1,0.39], tiron:[60,1.0,0.44], sent:[75,1.2,0.58], barra:[10,21,0.34], par:[11,23,0.29], m:415, n:9.0, p:68 },
  { press:[44,1.0,0.37], tiron:[52,0.9,0.42], sent:[65,1.1,0.55], barra:[8,18,0.33], par:[9,20,0.28], m:445, n:8.0, p:58 },
  { press:[46,1.0,0.38], tiron:[54,0.9,0.43], sent:[68,1.1,0.56], barra:[9,19,0.33], par:[10,21,0.29], m:438, n:8.5, p:61 },
  { press:[40,0.9,0.37], tiron:[47,0.8,0.42], sent:[60,1.0,0.54], barra:[7,17,0.32], par:[8,19,0.28], m:460, n:7.5, p:55 },
  { press:[50,1.0,0.38], tiron:[58,0.9,0.43], sent:[72,1.2,0.57], barra:[9,20,0.34], par:[10,22,0.29], m:425, n:8.5, p:64 },
  { press:[45,1.0,0.37], tiron:[53,0.9,0.42], sent:[66,1.1,0.55], barra:[8,18,0.33], par:[9,20,0.28], m:442, n:8.0, p:59 },
  { press:[54,1.1,0.39], tiron:[62,1.0,0.44], sent:[78,1.2,0.58], barra:[10,21,0.34], par:[11,24,0.29], m:410, n:9.0, p:70 },
]

const FACTORES = [1.0, 1.08, 1.15]

function calcVO2Fuerza(carga, recorrido, tiempo, peso) {
  if (!carga || !recorrido || !tiempo || !peso) return null
  return Math.round((1.8 * carga * recorrido) / (peso * (tiempo / 60)) * 100) / 100
}
function calcVO2Reps(reps, recorrido, tiempo) {
  if (!reps || !recorrido || !tiempo) return null
  return Math.round((1.8 * reps * recorrido) / (tiempo / 60) * 100) / 100
}
function calcVO2Mil500(seg) {
  if (!seg || seg <= 0) return null
  const vel = 1500 / (seg / 60)
  return { vo2: Math.round((3.5 + 0.2 * vel) * 100) / 100, vel_kmh: Math.round(vel * 60 / 1000 * 100) / 100 }
}
function calcVO2Navette(palier) {
  if (!palier) return null
  const vel = 8 + palier * 0.5
  return { vo2: Math.round((5.857 * vel - 19.458) * 100) / 100, vel_kmh: vel }
}

function generarTest(baseIdx, factorIdx, judokaId, mesoId, fecha) {
  const b = BASE[baseIdx]
  const f = FACTORES[factorIdx]
  const peso = b.p

  const p1rm = Math.round(b.press[0] * f)
  const t1rm = Math.round(b.tiron[0] * f)
  const s1rm = Math.round(b.sent[0] * f)
  const breps = Math.round(b.barra[0] * f)
  const preps = Math.round(b.par[0] * f)
  const mil500 = Math.round(b.m / f)
  const nav = Math.round(b.n * f * 2) / 2

  const r1500 = calcVO2Mil500(mil500)
  const rNav = calcVO2Navette(nav)

  return {
    judoka_id: judokaId,
    mesociclo_id: mesoId,
    fecha_registro: fecha,
    peso_corporal: peso,

    press_1rm: p1rm, press_tiempo: b.press[1], press_recorrido: b.press[2],
    press_vo2: calcVO2Fuerza(p1rm, b.press[2], b.press[1], peso),

    tiron_1rm: t1rm, tiron_tiempo: b.tiron[1], tiron_recorrido: b.tiron[2],
    tiron_vo2: calcVO2Fuerza(t1rm, b.tiron[2], b.tiron[1], peso),

    sentadilla_1rm: s1rm, sentadilla_tiempo: b.sent[1], sentadilla_recorrido: b.sent[2],
    sentadilla_vo2: calcVO2Fuerza(s1rm, b.sent[2], b.sent[1], peso),

    barra_reps: breps, barra_tiempo: b.barra[1], barra_recorrido: b.barra[2],
    barra_vo2: calcVO2Reps(breps, b.barra[2], b.barra[1]),

    paralelas_reps: preps, paralelas_tiempo: b.par[1], paralelas_recorrido: b.par[2],
    paralelas_vo2: calcVO2Reps(preps, b.par[2], b.par[1]),

    mil500_segundos: mil500, mil500_velocidad: r1500?.vel_kmh ?? null, mil500_vo2: r1500?.vo2 ?? null,
    navette_palier: nav, navette_velocidad: rNav?.vel_kmh ?? null, navette_vo2: rNav?.vo2 ?? null
  }
}

function ok(msg) { console.log(`  ✓ ${msg}`) }
function fail(msg, e) { console.error(`  ✗ ${msg}:`, e?.message || e); process.exit(1) }

async function main() {
  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║   SEED CONTINUACIÓN — mesociclos + tests     ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  // ── Mesociclos ───────────────────────────────
  console.log('▶ Creando 3 mesociclos...')
  const MESOS = [
    { nombre: 'Fase Preparatoria General',    fecha_inicio: '2025-01-15', fecha_fin: '2025-03-31', fase: 'general',    fecha_test: '2025-03-20' },
    { nombre: 'Fase Preparatoria Específica', fecha_inicio: '2025-04-01', fecha_fin: '2025-07-15', fase: 'especifica', fecha_test: '2025-07-05' },
    { nombre: 'Fase Competitiva',             fecha_inicio: '2025-07-20', fecha_fin: '2025-10-31', fase: 'competitiva',fecha_test: '2025-10-15' }
  ]
  const mesoIds = []
  const fechasTest = []
  for (const def of MESOS) {
    const { data, error } = await sb.from('mesociclos')
      .insert([{ macrociclo_id: MACRO_ID, nombre: def.nombre, fecha_inicio: def.fecha_inicio, fecha_fin: def.fecha_fin, fase: def.fase }])
      .select().single()
    if (error) fail(def.nombre, error)
    mesoIds.push(data.id)
    fechasTest.push(def.fecha_test)
    ok(`${def.nombre} (id: ${data.id})`)
  }

  // ── Asignar judokas al macrociclo ────────────
  console.log('\n▶ Asignando 20 judokas al macrociclo...')
  const macroRows = JUDOKA_IDS.map(jid => ({ macrociclo_id: MACRO_ID, judoka_id: jid, activo: true }))
  const { error: eMJ } = await sb.from('macrociclo_judokas').insert(macroRows)
  if (eMJ) fail('macrociclo_judokas', eMJ)
  ok(`${macroRows.length} judokas en macrociclo`)

  // ── Asignar judokas a mesociclos ─────────────
  console.log('\n▶ Asignando judokas a mesociclos...')
  // Meso 0: judokas 0-14 (15)
  // Meso 1: judokas 0-14 (mismos, muestran evolución)
  // Meso 2: todos 0-19 (20, pico de forma)
  const GRUPOS = [
    { mesoIdx: 0, idxs: Array.from({length:15},(_,i)=>i) },
    { mesoIdx: 1, idxs: Array.from({length:15},(_,i)=>i) },
    { mesoIdx: 2, idxs: Array.from({length:20},(_,i)=>i) }
  ]
  for (const g of GRUPOS) {
    const rows = g.idxs.map(i => ({ mesociclo_id: mesoIds[g.mesoIdx], judoka_id: JUDOKA_IDS[i] }))
    const { error } = await sb.from('mesociclo_judokas').insert(rows)
    if (error) fail(`mesociclo_judokas meso ${g.mesoIdx}`, error)
    ok(`${MESOS[g.mesoIdx].nombre}: ${rows.length} judokas`)
  }

  // ── Tests físicos ────────────────────────────
  console.log('\n▶ Insertando tests físicos con evolución progresiva...')
  let total = 0
  for (const g of GRUPOS) {
    const tests = g.idxs.map(i => generarTest(i, g.mesoIdx, JUDOKA_IDS[i], mesoIds[g.mesoIdx], fechasTest[g.mesoIdx]))
    const { error } = await sb.from('tests_fisicos').insert(tests)
    if (error) fail(`tests meso ${g.mesoIdx}`, error)
    total += tests.length
    ok(`${tests.length} tests → "${MESOS[g.mesoIdx].nombre}"`)
  }

  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║   COMPLETADO                                 ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log(`
  Resumen final:
    ✓ 3 mesociclos creados
    ✓ 20 judokas en macrociclo
    ✓ Meso 1 & 2: 15 judokas c/u  |  Meso 3: 20 judokas
    ✓ ${total} tests físicos con evolución +8% y +15%

  Login sensei: jr.gutierrez@addjc.bo / 123456789
`)
}

main().catch(e => { console.error('\n✗ Error fatal:', e.message); process.exit(1) })
