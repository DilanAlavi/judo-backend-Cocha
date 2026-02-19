const IUsuarioRepository = require('../../domain/repositories/IUsuarioRepository')
const supabase = require('../database/supabase')

class SupabaseUsuarioRepository extends IUsuarioRepository {
  async obtenerPorAuthId(authUserId) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (error) return null
    return data
  }

  async obtenerPorCorreo(correo) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .single()

    if (error) return null
    return data
  }
}

module.exports = SupabaseUsuarioRepository