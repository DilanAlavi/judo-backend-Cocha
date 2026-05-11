const supabase = require('../../infrastructure/database/supabase')
const AppError = require('../../shared/errors/AppError')

class ListarEstudiantesSensei {
  /**
   * Devuelve SOLO los judokas del club del sensei
   * que estan inscritos en al menos un macrociclo (tienen datos de reportes).
   * @param {string} usuarioId — id de la tabla usuarios (NO authUserId)
   */
  async ejecutar(usuarioId) {
    // 1. Buscar el registro del sensei para obtener su club_id
    const { data: sensei, error: errSensei } = await supabase
      .from('senseis')
      .select('id, club_id')
      .eq('usuario_id', usuarioId)
      .single()

    if (errSensei || !sensei) {
      throw new AppError('No se encontro registro de sensei para este usuario', 404)
    }

    if (!sensei.club_id) {
      throw new AppError('El sensei no tiene un club asignado', 400)
    }

    // 2. Traer judokas del club que estan inscritos en al menos un macrociclo
    //    El !inner hace un INNER JOIN: solo devuelve judokas que tienen
    //    al menos una fila en macrociclo_judokas
    const { data: judokas, error: errJudokas } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url),
        macrociclo_judokas!inner(id)
      `)
      .eq('club_id', sensei.club_id)

    if (errJudokas) {
      throw new AppError('Error al obtener judokas: ' + errJudokas.message, 500)
    }

    // 3. Eliminar duplicados (un judoka puede estar en varios macrociclos)
    const unicos = new Map()
    for (const j of (judokas || [])) {
      if (!unicos.has(j.id)) {
        const { macrociclo_judokas, ...sinMacro } = j
        unicos.set(j.id, sinMacro)
      }
    }

    const resultado = Array.from(unicos.values())
    console.log('[MisEstudiantes] club_id:', sensei.club_id, '| total club:', judokas?.length, '| unicos:', resultado.length)

    return resultado
  }
}

module.exports = ListarEstudiantesSensei
