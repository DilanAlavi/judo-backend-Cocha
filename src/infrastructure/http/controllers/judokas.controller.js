const ListarJudokas = require('../../../application/judokas/ListarJudokas')
const ListarJudokasSinClub = require('../../../application/judokas/ListarJudokasSinClub')
const ListarJudokasPorClub = require('../../../application/judokas/ListarJudokasPorClub')
const ObtenerJudoka = require('../../../application/judokas/ObtenerJudoka')
const SupabaseJudokaRepository = require('../../repositories/SupabaseJudokaRepository')
const supabase = require('../../database/supabase')

const repo = () => new SupabaseJudokaRepository()

const listar = async (req, res, next) => {
  try {
    const resultado = await new ListarJudokas(repo()).ejecutar(req.usuario.rol)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const listarSinClub = async (req, res, next) => {
  try {
    const resultado = await new ListarJudokasSinClub(repo()).ejecutar()
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const listarPorClub = async (req, res, next) => {
  try {
    const resultado = await new ListarJudokasPorClub(repo()).ejecutar(req.params.clubId)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const obtener = async (req, res, next) => {
  try {
    const resultado = await new ObtenerJudoka(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const obtenerPorUsuario = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url),
        clubes(id, nombre_club)
      `)
      .eq('usuario_id', req.params.usuarioId)
      .single()
    if (error || !data) return res.status(404).json({ ok: false, message: 'Judoka no encontrado' })
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

module.exports = { listar, listarSinClub, listarPorClub, obtener, obtenerPorUsuario }