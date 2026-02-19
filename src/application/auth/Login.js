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

    // Supabase verifica la contraseña
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password
    })

    if (error) throw new AppError('Credenciales incorrectas', 401)

    // Obtener datos del perfil con el rol
    const usuario = await this.usuarioRepository.obtenerPorAuthId(data.user.id)
    if (!usuario) throw new AppError('Usuario no encontrado', 404)

    if (!usuario.activo) throw new AppError('Usuario desactivado', 403)

    // Generar JWT propio con el rol incluido
    const token = generarToken({
      id: usuario.id,
      authUserId: data.user.id,
      correo: usuario.correo,
      rol: usuario.rol
    })

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellido_paterno,
        apellidoMaterno: usuario.apellido_materno,
        correo: usuario.correo,
        rol: usuario.rol
      }
    }
  }
}

module.exports = Login