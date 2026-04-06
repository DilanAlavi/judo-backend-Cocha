const ListarPorMesociclo   = require('../../../application/tests_fisicos/ListarPorMesociclo')
const ListarPorJudoka      = require('../../../application/tests_fisicos/ListarPorJudoka')
const ObtenerTestFisico    = require('../../../application/tests_fisicos/ObtenerTestFisico')
const CrearTestFisico      = require('../../../application/tests_fisicos/CrearTestFisico')
const ActualizarTestFisico = require('../../../application/tests_fisicos/ActualizarTestFisico')
const SupabaseTestFisicoRepository = require('../../repositories/SupabaseTestFisicoRepository')

const repo = () => new SupabaseTestFisicoRepository()

// GET /api/tests-fisicos/mesociclo/:mesocicloId
const listarPorMesociclo = async (req, res, next) => {
  try {
    const data = await new ListarPorMesociclo(repo()).ejecutar(req.params.mesocicloId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

// GET /api/tests-fisicos/judoka/:judokaId
const listarPorJudoka = async (req, res, next) => {
  try {
    const data = await new ListarPorJudoka(repo()).ejecutar(req.params.judokaId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

// GET /api/tests-fisicos/:id
const obtener = async (req, res, next) => {
  try {
    const data = await new ObtenerTestFisico(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

// POST /api/tests-fisicos
const crear = async (req, res, next) => {
  try {
    const { judoka_id, mesociclo_id } = req.body
    if (!judoka_id || !mesociclo_id) {
      return res.status(400).json({ ok: false, message: 'judoka_id y mesociclo_id son requeridos' })
    }
    const data = await new CrearTestFisico(repo()).ejecutar(req.body)
    res.status(201).json({ ok: true, data })
  } catch (e) {
    // Si ya existe un test para ese judoka/mesociclo (UNIQUE constraint)
    if (e.message && e.message.includes('unique')) {
      return res.status(400).json({ ok: false, message: 'Ya existe un test registrado para este judoka en este mesociclo' })
    }
    next(e)
  }
}

// PUT /api/tests-fisicos/:id
const actualizar = async (req, res, next) => {
  try {
    const data = await new ActualizarTestFisico(repo()).ejecutar(req.params.id, req.body)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

// PUT /api/tests-fisicos/judoka/:judokaId/mesociclo/:mesocicloId (crear o actualizar)
const guardarTest = async (req, res, next) => {
  try {
    const { judokaId, mesocicloId } = req.params
    const r = repo()

    // Verificar si ya existe
    const existente = await r.obtenerPorJudokaMesociclo(judokaId, mesocicloId)

    let data
    if (existente) {
      // Actualizar
      const uc = new ActualizarTestFisico(r)
      data = await uc.ejecutar(existente.id, {
        ...req.body,
        judoka_id: judokaId,
        mesociclo_id: mesocicloId
      })
    } else {
      // Crear
      const uc = new CrearTestFisico(r)
      data = await uc.ejecutar({
        ...req.body,
        judoka_id: judokaId,
        mesociclo_id: mesocicloId
      })
    }

    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

module.exports = { listarPorMesociclo, listarPorJudoka, obtener, crear, actualizar, guardarTest }
