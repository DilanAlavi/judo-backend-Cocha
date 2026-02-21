const CrearMacrociclo = require('../../../application/macrociclos/CrearMacrociclo')
const ObtenerMacrociclo = require('../../../application/macrociclos/ObtenerMacrociclo')
const ListarMacrociclos = require('../../../application/macrociclos/ListarMacrociclos')
const AsignarJudoka = require('../../../application/macrociclos/AsignarJudoka')
const SupabaseMacrocicloRepository = require('../../repositories/SupabaseMacrocicloRepository')

const repo = () => new SupabaseMacrocicloRepository()

const listar = async (req, res, next) => {
    try {
      let data
      if (req.usuario.rol === 'admin' || req.usuario.rol === 'asociacion') {
        data = await repo().listarTodos()
      } else {
        data = await new ListarMacrociclos(repo()).ejecutar(req.usuario.senseiId)
      }
      res.status(200).json({ ok: true, data })
    } catch (e) { next(e) }
  }

const obtener = async (req, res, next) => {
  try {
    const data = await new ObtenerMacrociclo(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const crear = async (req, res, next) => {
  try {
    const { nombre, fecha_inicio, fecha_fin } = req.body
    if (!nombre || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ ok: false, message: 'Nombre y fechas son requeridos' })
    }
    const data = await new CrearMacrociclo(repo()).ejecutar({
      nombre, fecha_inicio, fecha_fin,
      sensei_id: req.usuario.senseiId,
      activo: true
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

const asignarJudoka = async (req, res, next) => {
  try {
    const { judoka_id } = req.body
    if (!judoka_id) {
      return res.status(400).json({ ok: false, message: 'judoka_id es requerido' })
    }
    const data = await new AsignarJudoka(repo()).ejecutar(req.params.id, judoka_id)
    res.status(201).json({ ok: true, data })
  } catch (e) {
    if (e.message === 'El judoka ya tiene un macrociclo activo') {
      return res.status(400).json({ ok: false, message: e.message })
    }
    next(e)
  }
}

const quitarJudoka = async (req, res, next) => {
  try {
    await repo().quitarJudoka(req.params.macrocicloJudokaId)
    res.status(200).json({ ok: true, message: 'Judoka removido del macrociclo' })
  } catch (e) { next(e) }
}

module.exports = { listar, obtener, crear, actualizar, asignarJudoka, quitarJudoka }