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
      .select(`*, usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url), clubes(id, nombre_club)`)
      .eq('usuario_id', req.params.usuarioId)
      .single()
    if (error || !data) return res.status(404).json({ ok: false, message: 'Judoka no encontrado' })
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const actualizarDatos = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('judokas')
      .update({
        categoria: req.body.categoria,
        peso_competitivo: req.body.peso_competitivo,
        cinturon_actual: req.body.cinturon_actual
      })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const desactivar = async (req, res, next) => {
  try {
    const { judokaId } = req.params
    const { motivo } = req.body

    if (!motivo) return res.status(400).json({ ok: false, message: 'El motivo es requerido' })

    // Obtener datos del judoka antes de desactivar
    const { data: judoka } = await supabase
      .from('judokas')
      .select('*, usuarios(nombre, apellido_paterno)')
      .eq('id', judokaId)
      .single()

    if (!judoka) return res.status(404).json({ ok: false, message: 'Judoka no encontrado' })

    // Desactivar judoka
    await supabase
      .from('judokas')
      .update({ activo: false, club_id: null, entrenador_id: null })
      .eq('id', judokaId)

    // Guardar en historial
    await supabase
      .from('historial_desactivaciones')
      .insert([{
        judoka_id: judokaId,
        club_id: judoka.club_id,
        entrenador_id: judoka.entrenador_id,
        realizado_por_id: req.usuario.id,
        realizado_por_nombre: `${req.usuario.nombre || ''} ${req.usuario.apellidoPaterno || ''}`.trim(),
        motivo
      }])

    res.status(200).json({ ok: true, message: 'Judoka desactivado correctamente' })
  } catch (e) { next(e) }
}

const cambiarClub = async (req, res, next) => {
  try {
    const { judokaId } = req.params
    const { clubId, entrenadorId } = req.body

    if (!clubId) return res.status(400).json({ ok: false, message: 'El club es requerido' })

    const { data, error } = await supabase
      .from('judokas')
      .update({ club_id: clubId, entrenador_id: entrenadorId || null })
      .eq('id', judokaId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

module.exports = { listar, listarSinClub, listarPorClub, obtener, obtenerPorUsuario, actualizarDatos, desactivar, cambiarClub }