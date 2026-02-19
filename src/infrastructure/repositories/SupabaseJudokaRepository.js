const IJudokaRepository = require('../../domain/repositories/IJudokaRepository')
const supabase = require('../database/supabase')

class SupabaseJudokaRepository extends IJudokaRepository {
  async listarTodos() {
    const { data, error } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url)
      `)
    if (error) throw new Error(error.message)
    return data
  }

  async listarSinClub() {
    const { data, error } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo)
      `)
      .is('club_id', null)
    if (error) throw new Error(error.message)
    return data
  }

  async listarPorClub(clubId) {
    const { data, error } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url)
      `)
      .eq('club_id', clubId)
    if (error) throw new Error(error.message)
    return data
  }

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('judokas')
      .select(`
        *,
        usuarios(id, nombre, apellido_paterno, apellido_materno, correo, ci, genero, avatar_url),
        clubes(id, nombre_club)
      `)
      .eq('id', id)
      .single()
    if (error) return null
    return data
  }
}

module.exports = SupabaseJudokaRepository