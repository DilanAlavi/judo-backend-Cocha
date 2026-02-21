const CrearMesociclo = require('../../../application/mesociclos/CrearMesociclo')
const ObtenerMesociclo = require('../../../application/mesociclos/ObtenerMesociclo')
const ListarMesociclos = require('../../../application/mesociclos/ListarMesociclos')
const SupabaseMesocicloRepository = require('../../repositories/SupabaseMesocicloRepository')

const repo = () => new SupabaseMesocicloRepository()

const listarPorMacrociclo = async (req, res, next) => {
  try {
    const data = await new ListarMesociclos(repo()).ejecutar(req.params.macrocicloId)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const obtener = async (req, res, next) => {
  try {
    const data = await new ObtenerMesociclo(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const crear = async (req, res, next) => {
  try {
    const { macrociclo_id, nombre, fecha_inicio, fecha_fin } = req.body
    if (!macrociclo_id || !nombre || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ ok: false, message: 'Todos los campos son requeridos' })
    }
    const data = await new CrearMesociclo(repo()).ejecutar({
      macrociclo_id, nombre, fecha_inicio, fecha_fin
    })
    res.status(201).json({ ok: true, data })
  } catch (e) {
    if (e.message === 'Las fechas deben estar dentro del macrociclo') {
      return res.status(400).json({ ok: false, message: e.message })
    }
    next(e)
  }
}

const actualizar = async (req, res, next) => {
  try {
    const data = await repo().actualizar(req.params.id, req.body)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

module.exports = { listarPorMacrociclo, obtener, crear, actualizar }