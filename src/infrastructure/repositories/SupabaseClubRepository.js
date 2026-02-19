const IClubRepository = require('../../domain/repositories/IClubRepository')
const supabase = require('../database/supabase')

class SupabaseClubRepository extends IClubRepository {
  async crear(datos) {
    const { data, error } = await supabase
      .from('clubes')
      .insert([{
        nombre_club: datos.nombre,
        direccion: datos.direccion,
        telefono_contacto: datos.telefono,
        activo: true
      }])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async listar() {
    const { data, error } = await supabase
      .from('clubes')
      .select('*')
      .eq('activo', true)
      .order('nombre_club')
    if (error) throw new Error(error.message)
    return data
  }

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('clubes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }

  async obtenerPorDirectorTecnico(senseiId) {
    const { data, error } = await supabase
      .from('clubes')
      .select('*')
      .eq('director_tecnico_id', senseiId)
      .eq('activo', true)
    if (error) throw new Error(error.message)
    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('clubes')
      .update({
        nombre_club: datos.nombre,
        direccion: datos.direccion,
        telefono_contacto: datos.telefono
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

module.exports = SupabaseClubRepository