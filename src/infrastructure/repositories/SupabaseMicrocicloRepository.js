const supabase = require('../database/supabase')

class SupabaseMicrocicloRepository {
  async listarPorMesociclo(mesocicloId) {
    const { data, error } = await supabase
      .from('microciclos')
      .select(`
        *,
        microciclo_ejercicios(
          *,
          banco_ejercicios(nombre, categoria, tiempo_base, series_base, video_url)
        ),
        microciclo_judokas(
          judoka_id,
          judokas(usuario_id, usuarios(nombre, apellido_paterno))
        )
      `)
      .eq('mesociclo_id', mesocicloId)
      .order('fecha', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('microciclos')
      .select(`
        *,
        mesociclos(
          id, nombre, fecha_inicio, fecha_fin,
          macrociclos(id, nombre),
          mesociclo_judokas(
            id, judoka_id,
            judokas(id, usuarios(nombre, apellido_paterno))
          )
        ),
        microciclo_ejercicios(
          id, ejercicio_id, tiempo_modificado, series_modificadas, orden,
          banco_ejercicios(id, nombre, categoria, tiempo_base, series_base),
          microciclo_ejercicio_judokas(
            judoka_id,
            judokas(id, usuarios(nombre, apellido_paterno))
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // ✅ AQUÍ VA LA COPIA AUTOMÁTICA (y NO rompe nada más)
  async crear(datos) {
    // 1) Crear microciclo
    const { data, error } = await supabase
      .from('microciclos')
      .insert([datos])
      .select()
      .single()

    if (error) throw new Error(error.message)

    // 2) Copiar judokas del mesociclo al microciclo
    //    (si tu flujo asigna judokas al mesociclo, esto hace que evaluación funcione)
    const { data: mesoJudokas, error: errorMeso } = await supabase
      .from('mesociclo_judokas')
      .select('judoka_id')
      .eq('mesociclo_id', datos.mesociclo_id)

    if (errorMeso) throw new Error(errorMeso.message)

    if (mesoJudokas && mesoJudokas.length > 0) {
      const inserts = mesoJudokas.map(j => ({
        microciclo_id: data.id,
        judoka_id: j.judoka_id
      }))

      // Si existe UNIQUE(microciclo_id, judoka_id) esto evita duplicados si repites.
      const { error: errorInsert } = await supabase
        .from('microciclo_judokas')
        .upsert(inserts, { onConflict: 'microciclo_id,judoka_id' })

      if (errorInsert) throw new Error(errorInsert.message)
    }

    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('microciclos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async agregarEjercicio(datos) {
    const { data, error } = await supabase
      .from('microciclo_ejercicios')
      .insert([datos])
      .select(`*, banco_ejercicios(nombre, categoria, tiempo_base, series_base, video_url)`)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async actualizarEjercicio(id, datos) {
    const { data, error } = await supabase
      .from('microciclo_ejercicios')
      .update(datos)
      .eq('id', id)
      .select(`*, banco_ejercicios(nombre, categoria, tiempo_base, series_base, video_url)`)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async eliminarEjercicio(id) {
    const { error } = await supabase
      .from('microciclo_ejercicios')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  async asignarJudoka(microcicloId, judokaId) {
    const { data, error } = await supabase
      .from('microciclo_judokas')
      .insert([{ microciclo_id: microcicloId, judoka_id: judokaId }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async quitarJudoka(microcicloId, judokaId) {
    const { error } = await supabase
      .from('microciclo_judokas')
      .delete()
      .eq('microciclo_id', microcicloId)
      .eq('judoka_id', judokaId)

    if (error) throw new Error(error.message)
    return true
  }

  async listarTodos() {
    const { data, error } = await supabase
      .from('microciclos')
      .select(`
        *,
        mesociclos(
          id, nombre,
          macrociclos(id, nombre, sensei_id,
            senseis(usuario_id)
          )
        ),
        microciclo_ejercicios(
          id,
          banco_ejercicios(nombre),
          microciclo_ejercicio_judokas(judoka_id)
        )
      `)
      .order('fecha', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async listarPorSensei(senseiId) {
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

    const { data, error } = await supabase
      .from('microciclos')
      .select(`
        *,
        mesociclos(
          id, nombre,
          macrociclos(id, nombre)
        ),
        microciclo_ejercicios(
          id,
          banco_ejercicios(nombre),
          microciclo_ejercicio_judokas(judoka_id)
        )
      `)
      .in('mesociclo_id', mesos.map(m => m.id))
      .order('fecha', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async asignarJudokaEjercicio(microcicloEjercicioId, judokaId) {
    const { data, error } = await supabase
      .from('microciclo_ejercicio_judokas')
      .insert([{ microciclo_ejercicio_id: microcicloEjercicioId, judoka_id: judokaId }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async quitarJudokaEjercicio(microcicloEjercicioId, judokaId) {
    const { error } = await supabase
      .from('microciclo_ejercicio_judokas')
      .delete()
      .eq('microciclo_ejercicio_id', microcicloEjercicioId)
      .eq('judoka_id', judokaId)

    if (error) throw new Error(error.message)
    return true
  }
}

module.exports = SupabaseMicrocicloRepository