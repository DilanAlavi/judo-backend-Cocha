const ListarJudokas = require('../../../application/judokas/ListarJudokas')
const ListarJudokasSinClub = require('../../../application/judokas/ListarJudokasSinClub')
const ListarJudokasPorClub = require('../../../application/judokas/ListarJudokasPorClub')
const ListarEstudiantesSensei = require('../../../application/judokas/ListarEstudiantesSensei')
const ObtenerJudoka = require('../../../application/judokas/ObtenerJudoka')
const SupabaseJudokaRepository = require('../../repositories/SupabaseJudokaRepository')
const supabase = require('../../database/supabase')

const repo = () => new SupabaseJudokaRepository()

const listar = async (req, res, next) => {
  try {
    const { rol, id: usuarioId } = req.usuario

    console.log('[GET /judokas] rol:', rol, '| usuarioId:', usuarioId)

    let clubId = null
    if (rol === 'sensei') {
      const { data: senseiRow, error: errSensei } = await supabase
        .from('senseis')
        .select('club_id')
        .eq('usuario_id', usuarioId)
        .single()

      console.log('[GET /judokas] senseiRow:', senseiRow, '| error:', errSensei)
      clubId = senseiRow?.club_id || null
    }

    console.log('[GET /judokas] clubId final:', clubId)

    const resultado = await new ListarJudokas(repo()).ejecutar(rol, clubId)
    console.log('[GET /judokas] judokas devueltos:', resultado?.length)
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

const misEstudiantes = async (req, res, next) => {
  try {
    const { id: usuarioId } = req.usuario
    console.log('[GET /judokas/mis-estudiantes] usuarioId:', usuarioId)
    const resultado = await new ListarEstudiantesSensei().ejecutar(usuarioId)
    console.log('[GET /judokas/mis-estudiantes] devueltos:', resultado?.length)
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
      .select(`*, usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url, fecha_nacimiento, numero_celular), clubes(id, nombre_club)`)
      .eq('usuario_id', req.params.usuarioId)
      .single()
    if (error || !data) return res.status(404).json({ ok: false, message: 'Judoka no encontrado' })
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const actualizarDatos = async (req, res, next) => {
  try {
    const ESTADOS_VALIDOS = ['activo', 'lesionado', 'restringido', 'reincorporacion']
    const { categoria, peso_competitivo, cinturon_actual, estado_medico } = req.body

    if (estado_medico && !ESTADOS_VALIDOS.includes(estado_medico)) {
      return res.status(400).json({ ok: false, message: 'Estado médico no válido' })
    }

    // Solo incluir los campos que vienen en el body para no pisar otros con undefined
    const campos = {}
    if (categoria        !== undefined) campos.categoria        = categoria
    if (peso_competitivo !== undefined) campos.peso_competitivo = peso_competitivo
    if (cinturon_actual  !== undefined) campos.cinturon_actual  = cinturon_actual
    if (estado_medico    !== undefined) campos.estado_medico    = estado_medico

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ ok: false, message: 'No se enviaron campos a actualizar' })
    }

    const { data, error } = await supabase
      .from('judokas')
      .update(campos)
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

    const { data: judoka } = await supabase
      .from('judokas')
      .select('*, usuarios(nombre, apellido_paterno)')
      .eq('id', judokaId)
      .single()

    if (!judoka) return res.status(404).json({ ok: false, message: 'Judoka no encontrado' })

    // Obtener nombre del que desactiva
    const { data: realizadoPor } = await supabase
      .from('usuarios')
      .select('nombre, apellido_paterno')
      .eq('id', req.usuario.id)
      .single()

    await supabase
      .from('judokas')
      .update({ activo: false, club_id: null, entrenador_id: null })
      .eq('id', judokaId)

    await supabase
      .from('historial_desactivaciones')
      .insert([{
        judoka_id: judokaId,
        club_id: judoka.club_id,
        entrenador_id: judoka.entrenador_id,
        realizado_por_id: req.usuario.id,
        realizado_por_nombre: realizadoPor
          ? `${realizadoPor.nombre} ${realizadoPor.apellido_paterno}`
          : 'Sin nombre',
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

const listarHistorial = async (req, res, next) => {
  try {
    let query = supabase
      .from('historial_desactivaciones')
      .select(`
        *,
        judokas(
          usuario_id,
          usuarios(nombre, apellido_paterno, apellido_materno)
        ),
        clubes(nombre_club),
        senseis(
          usuarios(nombre, apellido_paterno)
        ),
        realizadoPor:usuarios!historial_desactivaciones_realizado_por_id_fkey(
          nombre, apellido_paterno
        )
      `)
      .order('fecha', { ascending: false })

    // Si es sensei solo ve los de su club
    if (req.usuario.rol === 'sensei') {
      query = query.eq('club_id', req.usuario.clubId)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}
module.exports = { listar, listarSinClub, listarPorClub, misEstudiantes, obtener, obtenerPorUsuario, actualizarDatos, desactivar, cambiarClub, listarHistorial }