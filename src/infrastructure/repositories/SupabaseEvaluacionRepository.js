const supabase = require('../database/supabase')

class SupabaseEvaluacionRepository {

  async listarParaEvaluar(senseiId, filtroEstado) {
    const { data: macros, error: errorMacros } = await supabase
      .from('macrociclos')
      .select('id')
      .eq('sensei_id', senseiId)
      .eq('activo', true)

    if (errorMacros) throw new Error(errorMacros.message)
    if (!macros || macros.length === 0) return []

    const { data: mesos, error: errorMesos } = await supabase
      .from('mesociclos')
      .select('id')
      .in('macrociclo_id', macros.map(m => m.id))

    if (errorMesos) throw new Error(errorMesos.message)
    if (!mesos || mesos.length === 0) return []

    let query = supabase
      .from('microciclos')
      .select(`
        id, fecha, estado,
        mesociclos(id, nombre, macrociclos(id, nombre)),
        microciclo_judokas(
          judoka_id, comentario_judoka,
          judokas(id, usuarios(nombre, apellido_paterno, apellido_materno))
        ),
        microciclo_ejercicios(
          id, orden,
          banco_ejercicios(id, nombre),
          microciclo_ejercicio_judokas(judoka_id, nota, comentario_sensei)
        )
      `)
      .in('mesociclo_id', mesos.map(m => m.id))
      .order('fecha', { ascending: false })

    if (filtroEstado) query = query.eq('estado', filtroEstado)

    const { data, error } = await query
    if (error) throw new Error(error.message)
    if (!data) return []

    return data.map(mc => {
      const bloqueado = mc.estado !== 'Pendiente'
      const judokas = (mc.microciclo_judokas || [])
      .map(mj => {
        const judokaId = mj.judoka_id
        const u = mj.judokas?.usuarios
        const nombre = u ? `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno || ''}`.trim() : ''
    
        // ✅ SOLO ejercicios asignados a este judoka
        const notasEjercicios = (mc.microciclo_ejercicios || [])
          .filter(me => (me.microciclo_ejercicio_judokas || []).some(n => n.judoka_id === judokaId))
          .map(me => {
            const notaJudoka = (me.microciclo_ejercicio_judokas || []).find(n => n.judoka_id === judokaId)
            return {
              microciclo_ejercicio_id: me.id,
              judoka_id: judokaId,
              ejercicio_nombre: me.banco_ejercicios?.nombre || '',
              orden: me.orden,
              nota: notaJudoka?.nota ?? null,
              comentario_sensei: notaJudoka?.comentario_sensei ?? null
            }
          })
          .sort((a, b) => a.orden - b.orden)
    
        // ✅ Si no tiene ejercicios asignados, NO debe aparecer en Evaluación
        if (notasEjercicios.length === 0) return null
    
        const notasConValor = notasEjercicios.filter(n => n.nota !== null)
        const promedio = notasConValor.length > 0
          ? Math.round((notasConValor.reduce((sum, n) => sum + n.nota, 0) / notasConValor.length) * 10) / 10
          : null
    
        return {
          judoka_id: judokaId,
          judoka_nombre: nombre,
          comentario_judoka: mj.comentario_judoka,
          promedio_notas: promedio,
          notas_ejercicios: notasEjercicios
        }
      })
      .filter(Boolean)

      return {
        microciclo_id: mc.id,
        fecha: mc.fecha,
        estado: mc.estado,
        bloqueado,
        mesociclo: mc.mesociclos,
        judokas
      }
    })
  }

  async cambiarEstado(microcicloId, nuevoEstado) {
    const { data, error } = await supabase
      .from('microciclos')
      .update({ estado: nuevoEstado })
      .eq('id', microcicloId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async guardarNota(microcicloEjercicioId, judokaId, nota, comentarioSensei) {
    const { data, error } = await supabase
      .from('microciclo_ejercicio_judokas')
      .upsert(
        {
          microciclo_ejercicio_id: microcicloEjercicioId,
          judoka_id: judokaId,
          nota: nota ?? null,
          comentario_sensei: comentarioSensei ?? null
        },
        { onConflict: 'microciclo_ejercicio_id,judoka_id' }
      )
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async listarEvaluacionesJudoka(judokaId) {
    const { data, error } = await supabase
      .from('microciclo_judokas')
      .select(`
        comentario_judoka,
        microciclos(
          id, fecha, estado,
          mesociclos(id, nombre, macrociclos(id, nombre)),
          microciclo_ejercicios(
            id, orden,
            banco_ejercicios(nombre),
            microciclo_ejercicio_judokas(judoka_id, nota, comentario_sensei)
          )
        )
      `)
      .eq('judoka_id', judokaId)

    if (error) throw new Error(error.message)
    if (!data) return []

    return data.map(mj => {
      const mc = mj.microciclos

      const notasEjercicios = (mc.microciclo_ejercicios || [])
        .filter(me => (me.microciclo_ejercicio_judokas || []).some(n => n.judoka_id === judokaId))
        .map(me => {
          const notaJudoka = (me.microciclo_ejercicio_judokas || []).find(n => n.judoka_id === judokaId)
          return {
            microciclo_ejercicio_id: me.id,
            ejercicio_nombre: me.banco_ejercicios?.nombre || '',
            orden: me.orden,
            nota: notaJudoka?.nota ?? null,
            comentario_sensei: notaJudoka?.comentario_sensei ?? null
          }
        })
        .sort((a, b) => a.orden - b.orden)

      const notasConValor = notasEjercicios.filter(n => n.nota !== null)
      const promedio = notasConValor.length > 0
        ? Math.round((notasConValor.reduce((sum, n) => sum + n.nota, 0) / notasConValor.length) * 10) / 10
        : null

      return {
        microciclo_id: mc.id,
        fecha: mc.fecha,
        estado: mc.estado,
        mesociclo: mc.mesociclos,
        promedio_notas: promedio,
        comentario_judoka: mj.comentario_judoka,
        notas_ejercicios: notasEjercicios
      }
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  async guardarComentarioJudoka(microcicloId, judokaId, comentario) {
    const { data, error } = await supabase
      .from('microciclo_judokas')
      .update({ comentario_judoka: comentario })
      .eq('microciclo_id', microcicloId)
      .eq('judoka_id', judokaId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async listarTodasAdmin(filtroEstado, clubId) {
    let query = supabase
      .from('microciclos')
      .select(`
        id, fecha, estado,
        mesociclos(
          id, nombre,
          macrociclos(id, nombre, club_id, sensei_id,
            senseis(usuarios(nombre, apellido_paterno))
          )
        ),
        microciclo_judokas(
          judoka_id, comentario_judoka,
          judokas(id, usuarios(nombre, apellido_paterno, apellido_materno))
        ),
        microciclo_ejercicios(
          id, orden,
          banco_ejercicios(nombre),
          microciclo_ejercicio_judokas(judoka_id, nota, comentario_sensei)
        )
      `)
      .order('fecha', { ascending: false })

    if (filtroEstado) query = query.eq('estado', filtroEstado)

    const { data, error } = await query
    if (error) throw new Error(error.message)
    if (!data) return []

    let resultado = data
    if (clubId) {
      resultado = data.filter(mc => mc.mesociclos?.macrociclos?.club_id === clubId)
    }

    return resultado
  }

  // ✅ para validar "Completado" = sin notas faltantes
  async resumenNotasMicrociclo(microcicloId) {
    const { data, error } = await supabase
      .from('microciclo_ejercicio_judokas')
      .select(`
        nota,
        microciclo_ejercicios!inner(microciclo_id)
      `)
      .eq('microciclo_ejercicios.microciclo_id', microcicloId)

    if (error) throw new Error(error.message)

    const total = (data || []).length
    const sinNota = (data || []).filter(x => x.nota === null || x.nota === undefined).length

    return {
      total_asignaciones: total,
      sin_nota: sinNota,
      con_nota: total - sinNota
    }
  }
}

module.exports = SupabaseEvaluacionRepository