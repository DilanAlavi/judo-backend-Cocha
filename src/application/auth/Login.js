const AppError = require('../../shared/errors/AppError')
const { generarToken } = require('../../shared/utils/jwt')
const supabase = require('../../infrastructure/database/supabase')

class Login {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository
  }

  async ejecutar({ correo, password }) {
    if (!correo || !password) {
      throw new AppError('Correo y contraseña son requeridos', 400)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password
    })

    if (error) throw new AppError('Credenciales incorrectas', 401)

    const usuario = await this.usuarioRepository.obtenerPorAuthId(data.user.id)
    if (!usuario) throw new AppError('Usuario no encontrado', 404)
    if (!usuario.activo) throw new AppError('Usuario desactivado', 403)

    // Obtener id especifico segun rol
    let rolId = null
    if (usuario.rol === 'sensei') {
      const { data: sensei } = await supabase
        .from('senseis')
        .select('id, club_id')
        .eq('usuario_id', usuario.id)
        .single()
      if (sensei) rolId = { senseiId: sensei.id, clubId: sensei.club_id }
    }

    if (usuario.rol === 'judoka') {
      const { data: judoka } = await supabase
        .from('judokas')
        .select('id')
        .eq('usuario_id', usuario.id)
        .single()
      if (judoka) rolId = { judokaId: judoka.id }
    }

    const token = generarToken({
      id: usuario.id,
      authUserId: data.user.id,
      correo: usuario.correo,
      rol: usuario.rol,
      ...rolId
    })

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellido_paterno,
        apellidoMaterno: usuario.apellido_materno,
        correo: usuario.correo,
        rol: usuario.rol,
        ...rolId
      }
    }
  }
}

module.exports = Login