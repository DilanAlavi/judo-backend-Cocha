const GetMicrociclosParaEvaluar = require('../../../application/evaluacion/GetMicrociclosParaEvaluar')
const CambiarEstadoMicrociclo = require('../../../application/evaluacion/CambiarEstadoMicrociclo')
const GuardarNota = require('../../../application/evaluacion/GuardarNota')
const GetMisEvaluaciones = require('../../../application/evaluacion/GetMisEvaluaciones')
const GuardarComentarioJudoka = require('../../../application/evaluacion/GuardarComentarioJudoka')
const SupabaseEvaluacionRepository = require('../../repositories/SupabaseEvaluacionRepository')

const repo = () => new SupabaseEvaluacionRepository()

const listarParaSensei = async (req, res, next) => {
  try {
    const { estado } = req.query
    const data = await new GetMicrociclosParaEvaluar(repo()).ejecutar(req.usuario.senseiId, estado)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const cambiarEstado = async (req, res, next) => {
  try {
    const { estadoActual, nuevoEstado } = req.body
    if (!estadoActual || !nuevoEstado) {
      return res.status(400).json({ ok: false, message: 'estadoActual y nuevoEstado son requeridos' })
    }
    const data = await new CambiarEstadoMicrociclo(repo()).ejecutar(req.params.id, estadoActual, nuevoEstado)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const guardarNota = async (req, res, next) => {
  try {
    const { microcicloEjercicioId, judokaId, nota, comentarioSensei, estadoMicrociclo } = req.body
    if (!microcicloEjercicioId || !judokaId) {
      return res.status(400).json({ ok: false, message: 'microcicloEjercicioId y judokaId son requeridos' })
    }
    const data = await new GuardarNota(repo()).ejecutar(
      microcicloEjercicioId, judokaId, nota ?? null, comentarioSensei ?? null, estadoMicrociclo
    )
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const misEvaluaciones = async (req, res, next) => {
  try {
    const data = await new GetMisEvaluaciones(repo()).ejecutar(req.usuario.judokaId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const guardarComentarioJudoka = async (req, res, next) => {
  try {
    const { microcicloId, comentario, estadoMicrociclo } = req.body
    if (!microcicloId || !comentario) {
      return res.status(400).json({ ok: false, message: 'microcicloId y comentario son requeridos' })
    }
    const data = await new GuardarComentarioJudoka(repo()).ejecutar(
      microcicloId, req.usuario.judokaId, comentario, estadoMicrociclo
    )
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const listarAdmin = async (req, res, next) => {
  try {
    const { estado, clubId } = req.query
    const data = await repo().listarTodasAdmin(estado, clubId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

module.exports = { listarParaSensei, cambiarEstado, guardarNota, misEvaluaciones, guardarComentarioJudoka, listarAdmin }