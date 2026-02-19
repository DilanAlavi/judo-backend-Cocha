const IAtletaClubRepository = require('../../domain/repositories/IAtletaClubRepository')
const supabase = require('../database/supabase')

class SupabaseAtletaClubRepository extends IAtletaClubRepository {
  async asignar(datos) {
    const { data, error } = await supabase
      .from('atletas_club')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async obtenerActivoPorJudoka(judokaId) {
    const { data, error } = await supabase
      .from('atletas_club')
      .select('*')
      .eq('judoka_id', judokaId)
      .eq('activo', true)
      .single()
    if (error) return null
    return data
  }

  async historialPorJudoka(judokaId) {
    const { data, error } = await supabase
      .from('atletas_club')
      .select(`*, clubes(nombre), senseis(id, usuarios(nombre, apellido_paterno))`)
      .eq('judoka_id', judokaId)
      .order('fecha_ingreso', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  async desactivar(id, datos) {
    const { data, error } = await supabase
      .from('atletas_club')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

module.exports = SupabaseAtletaClubRepository