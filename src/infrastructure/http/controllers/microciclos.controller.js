const CrearMicrociclo = require('../../../application/microciclos/CrearMicrociclo')
const ObtenerMicrociclo = require('../../../application/microciclos/ObtenerMicrociclo')
const ListarMicrociclos = require('../../../application/microciclos/ListarMicrociclos')
const AgregarEjercicio = require('../../../application/microciclos/AgregarEjercicio')
const ActualizarEjercicio = require('../../../application/microciclos/ActualizarEjercicio')
const EliminarEjercicio = require('../../../application/microciclos/EliminarEjercicio')
const SupabaseMicrocicloRepository = require('../../repositories/SupabaseMicrocicloRepository')

const repo = () => new SupabaseMicrocicloRepository()

const listarPorMesociclo = async (req, res, next) => {
  try {
    const data = await new ListarMicrociclos(repo()).ejecutar(req.params.mesocicloId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const obtener = async (req, res, next) => {
  try {
    const data = await new ObtenerMicrociclo(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const crear = async (req, res, next) => {
  try {
    const { mesociclo_id, fecha } = req.body
    if (!mesociclo_id || !fecha) {
      return res.status(400).json({ ok: false, message: 'Mesociclo y fecha son requeridos' })
    }
    const data = await new CrearMicrociclo(repo()).ejecutar({
      mesociclo_id, fecha, estado: 'Pendiente'
    })
    res.status(201).json({ ok: true, data })
  } catch (e) { next(e) }
}

const actualizar = async (req, res, next) => {
  try {
    const data = await repo().actualizar(req.params.id, req.body)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const agregarEjercicio = async (req, res, next) => {
  try {
    const { ejercicio_id, tiempo_modificado, series_modificadas, orden } = req.body
    if (!ejercicio_id) {
      return res.status(400).json({ ok: false, message: 'ejercicio_id es requerido' })
    }
    const data = await new AgregarEjercicio(repo()).ejecutar({
      microciclo_id: req.params.id,
      ejercicio_id,
      tiempo_modificado: tiempo_modificado || null,
      series_modificadas: series_modificadas || null,
      orden: orden || 0,
      completado_judoka: false
    })
    res.status(201).json({ ok: true, data })
  } catch (e) { next(e) }
}

const actualizarEjercicio = async (req, res, next) => {
  try {
    const data = await new ActualizarEjercicio(repo()).ejecutar(req.params.ejercicioId, req.body)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const eliminarEjercicio = async (req, res, next) => {
  try {
    await new EliminarEjercicio(repo()).ejecutar(req.params.ejercicioId)
    res.status(200).json({ ok: true, message: 'Ejercicio eliminado' })
  } catch (e) { next(e) }
}

const asignarJudoka = async (req, res, next) => {
  try {
    const { judoka_id } = req.body
    if (!judoka_id) return res.status(400).json({ ok: false, message: 'judoka_id requerido' })
    const data = await repo().asignarJudoka(req.params.id, judoka_id)
    res.status(201).json({ ok: true, data })
  } catch (e) { next(e) }
}

const quitarJudoka = async (req, res, next) => {
  try {
    await repo().quitarJudoka(req.params.id, req.params.judokaId)
    res.status(200).json({ ok: true, message: 'Judoka removido' })
  } catch (e) { next(e) }
}
const listarTodos = async (req, res, next) => {
    try {
      let data
      if (req.usuario.rol === 'admin' || req.usuario.rol === 'asociacion') {
        data = await repo().listarTodos()
      } else {
        data = await repo().listarPorSensei(req.usuario.senseiId)
      }
      res.status(200).json({ ok: true, data })
    } catch (e) { next(e) }
  }
  const asignarJudokaEjercicio = async (req, res, next) => {
    try {
      const { judoka_id } = req.body
      if (!judoka_id) return res.status(400).json({ ok: false, message: 'judoka_id requerido' })
      const data = await repo().asignarJudokaEjercicio(req.params.ejercicioId, judoka_id)
      res.status(201).json({ ok: true, data })
    } catch (e) { next(e) }
  }
  
  const quitarJudokaEjercicio = async (req, res, next) => {
    try {
      await repo().quitarJudokaEjercicio(req.params.ejercicioId, req.params.judokaId)
      res.status(200).json({ ok: true })
    } catch (e) { next(e) }
  }

module.exports = {
  listarPorMesociclo, obtener, crear, actualizar,
  agregarEjercicio, actualizarEjercicio, eliminarEjercicio,
  asignarJudoka, quitarJudoka,listarTodos, asignarJudokaEjercicio,quitarJudokaEjercicio
}