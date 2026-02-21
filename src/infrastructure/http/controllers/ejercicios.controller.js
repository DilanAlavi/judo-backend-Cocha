const ListarEjercicios = require('../../../application/ejercicios/ListarEjercicios')
const ObtenerEjercicio = require('../../../application/ejercicios/ObtenerEjercicio')
const CrearEjercicio = require('../../../application/ejercicios/CrearEjercicio')
const ActualizarEjercicio = require('../../../application/ejercicios/ActualizarEjercicio')
const SupabaseEjercicioRepository = require('../../repositories/SupabaseEjercicioRepository')

const repo = () => new SupabaseEjercicioRepository()

const listar = async (req, res, next) => {
  try {
    const data = await new ListarEjercicios(repo()).ejecutar()
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const obtener = async (req, res, next) => {
  try {
    const data = await new ObtenerEjercicio(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const crear = async (req, res, next) => {
  try {
    const { nombre, categoria, tiempo_base, series_base, descripcion, video_url } = req.body
    if (!nombre || !categoria || !tiempo_base) {
      return res.status(400).json({ ok: false, message: 'Nombre, categoría y tiempo base son requeridos' })
    }
    const data = await new CrearEjercicio(repo()).ejecutar({
      nombre, categoria, tiempo_base,
      series_base: series_base || null,
      descripcion: descripcion || null,
      video_url: video_url || null,
      creado_por_id: req.usuario.id
    })
    res.status(201).json({ ok: true, data })
  } catch (e) { next(e) }
}

const actualizar = async (req, res, next) => {
  try {
    const data = await new ActualizarEjercicio(repo()).ejecutar(req.params.id, req.body)
    res.status(200).json({ ok: true, data })
  } catch (e) { next(e) }
}

const desactivar = async (req, res, next) => {
  try {
    await repo().desactivar(req.params.id)
    res.status(200).json({ ok: true, message: 'Ejercicio desactivado' })
  } catch (e) { next(e) }
}

module.exports = { listar, obtener, crear, actualizar, desactivar }