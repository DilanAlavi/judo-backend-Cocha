const AppError = require('../../shared/errors/AppError')
const supabase = require('../../infrastructure/database/supabase')

class Registro {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository
  }

  async ejecutar({ nombre, apellidoPaterno, apellidoMaterno, ci, correo, password, rol, fechaNacimiento, genero, telefono, clubId }) {
    if (!correo || !password || !nombre || !rol) {
      throw new AppError('Faltan campos requeridos', 400)
    }

    const rolesPermitidos = ['judoka', 'sensei', 'asociacion', 'admin']
    if (!rolesPermitidos.includes(rol)) {
      throw new AppError('Rol no válido', 400)
    }

    const existe = await this.usuarioRepository.obtenerPorCorreo(correo)
    if (existe) throw new AppError('El correo ya está registrado', 409)

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

    // Esperar trigger
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Obtener usuario creado
    const nuevoUsuario = await this.usuarioRepository.obtenerPorCorreo(correo)
    if (!nuevoUsuario) throw new AppError('Error al crear usuario', 500)

    // Actualizar CI y telefono
    await supabase
      .from('usuarios')
      .update({ ci, numero_celular: telefono })
      .eq('id', nuevoUsuario.id)

    // Crear registro según rol
    if (rol === 'judoka') {
      await supabase.from('judokas').insert([{
        usuario_id: nuevoUsuario.id,
        club_id: clubId || null,
        categoria: null,
        peso_competitivo: null,
        cinturon_actual: null
      }])
    }

    if (rol === 'sensei') {
      await supabase.from('senseis').insert([{
        usuario_id: nuevoUsuario.id,
        club_id: clubId || null
      }])
    }

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