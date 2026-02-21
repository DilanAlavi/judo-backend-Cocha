const supabase = require('../database/supabase')

class SupabaseMesocicloRepository {
  async listarPorMacrociclo(macrocicloId) {
    const { data, error } = await supabase
      .from('mesociclos')
      .select(`*, microciclos(*)`)
      .eq('macrociclo_id', macrocicloId)
      .order('fecha_inicio', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('mesociclos')
      .select(`
        *,
        macrociclos(nombre, fecha_inicio, fecha_fin),
        microciclos(*)
      `)
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async crear(datos) {
    const { data: macro } = await supabase
      .from('macrociclos')
      .select('fecha_inicio, fecha_fin')
      .eq('id', datos.macrociclo_id)
      .single()

    if (!macro) throw new Error('Macrociclo no encontrado')

    if (datos.fecha_inicio < macro.fecha_inicio || datos.fecha_fin > macro.fecha_fin) {
      throw new Error('Las fechas deben estar dentro del macrociclo')
    }

    const { data, error } = await supabase
      .from('mesociclos')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('mesociclos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

module.exports = SupabaseMesocicloRepository