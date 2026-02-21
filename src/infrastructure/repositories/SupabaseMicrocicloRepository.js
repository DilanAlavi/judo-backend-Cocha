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
        mesociclos(nombre, macrociclo_id),
        microciclo_ejercicios(
          *,
          banco_ejercicios(nombre, categoria, tiempo_base, series_base, descripcion, video_url)
        ),
        microciclo_judokas(
          judoka_id,
          judokas(usuario_id, usuarios(nombre, apellido_paterno))
        )
      `)
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async crear(datos) {
    const { data, error } = await supabase
      .from('microciclos')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
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
}

module.exports = SupabaseMicrocicloRepository