const AsignarJudoka = require('../../../application/atletasClub/AsignarJudoka')
const CambiarClub = require('../../../application/atletasClub/CambiarClub')
const DesactivarJudoka = require('../../../application/atletasClub/DesactivarJudoka')
const HistorialJudoka = require('../../../application/atletasClub/HistorialJudoka')
const SupabaseAtletaClubRepository = require('../../repositories/SupabaseAtletaClubRepository')

const repo = () => new SupabaseAtletaClubRepository()

const asignar = async (req, res, next) => {
  try {
    const resultado = await new AsignarJudoka(repo()).ejecutar(req.body, req.usuario.rol)
    res.status(201).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const cambiarClub = async (req, res, next) => {
  try {
    const resultado = await new CambiarClub(repo()).ejecutar(req.params.judokaId, req.body, req.usuario.rol)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const desactivar = async (req, res, next) => {
  try {
    const resultado = await new DesactivarJudoka(repo()).ejecutar(req.params.judokaId, req.body, req.usuario.rol)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const historial = async (req, res, next) => {
  try {
    const resultado = await new HistorialJudoka(repo()).ejecutar(req.params.judokaId)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

module.exports = { asignar, cambiarClub, desactivar, historial }