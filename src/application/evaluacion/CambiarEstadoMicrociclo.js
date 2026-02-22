const AppError = require('../../shared/errors/AppError')

const TRANSICIONES_VALIDAS = {
  Pendiente: ['Completado', 'Cancelado'],
  Completado: [],
  Cancelado: []
}

class CambiarEstadoMicrociclo {
  constructor(repo) {
    this.repo = repo
  }

  async ejecutar(microcicloId, estadoActual, nuevoEstado) {
    const permitidos = TRANSICIONES_VALIDAS[estadoActual] || []
    if (!permitidos.includes(nuevoEstado)) {
      throw new AppError(`No se puede cambiar de "${estadoActual}" a "${nuevoEstado}"`, 400)
    }

    // ✅ Regla: para marcar Completado, todo debe tener nota
    if (nuevoEstado === 'Completado') {
      const resumen = await this.repo.resumenNotasMicrociclo(microcicloId)

      if (!resumen || resumen.total_asignaciones === 0) {
        throw new AppError('No se puede completar: no hay judokas/ejercicios asignados para evaluar', 400)
      }

      if (resumen.sin_nota > 0) {
        throw new AppError(`No se puede completar: faltan ${resumen.sin_nota} nota(s) por asignar`, 400)
      }
    }

    return await this.repo.cambiarEstado(microcicloId, nuevoEstado)
  }
}

module.exports = CambiarEstadoMicrociclo