const supabase = require('../database/supabase')

class SupabaseTestFisicoRepository {

  async listarPorMesociclo(mesocicloId) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .select('*')
      .eq('mesociclo_id', mesocicloId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async listarPorJudoka(judokaId) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .select(`
        *,
        mesociclo:mesociclo_id (
          id, nombre, fecha_inicio, fecha_fin, fase,
          macrociclo:macrociclo_id (id, nombre)
        )
      `)
      .eq('judoka_id', judokaId)
      .order('fecha_registro', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async obtenerPorJudokaMesociclo(judokaId, mesocicloId) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .select('*')
      .eq('judoka_id', judokaId)
      .eq('mesociclo_id', mesocicloId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data
  }

  async crear(datos) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('tests_fisicos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

module.exports = SupabaseTestFisicoRepository
