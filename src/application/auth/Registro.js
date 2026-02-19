const AppError = require('../../shared/errors/AppError')
const supabase = require('../../infrastructure/database/supabase')

class Registro {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository
  }

  async ejecutar({ nombre, apellidoPaterno, apellidoMaterno, correo, password, rol, fechaNacimiento, genero }) {
    // Validaciones básicas
    if (!correo || !password || !nombre || !rol) {
      throw new AppError('Faltan campos requeridos', 400)
    }

    const rolesPermitidos = ['judoka', 'sensei', 'asociacion', 'admin']
    if (!rolesPermitidos.includes(rol)) {
      throw new AppError('Rol no válido', 400)
    }

    // Verificar si ya existe
    const existe = await this.usuarioRepository.obtenerPorCorreo(correo)
    if (existe) throw new AppError('El correo ya está registrado', 409)

    // Crear en Supabase Auth (el trigger crea automáticamente en public.usuarios)
    const { data, error } = await supabase.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,
      user_metadata: {
        nombres: nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        fecha_nacimiento: fechaNacimiento,
        genero: genero,
        rol: rol,
        user_type: rol
      }
    })

    if (error) throw new AppError(error.message, 400)

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: data.user.id,
        correo: data.user.email,
        rol
      }
    }
  }
}

module.exports = Registro