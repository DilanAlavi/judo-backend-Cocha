const CrearClub = require('../../../application/clubes/CrearClub')
const ListarClubes = require('../../../application/clubes/ListarClubes')
const ObtenerClub = require('../../../application/clubes/ObtenerClub')
const ActualizarClub = require('../../../application/clubes/ActualizarClub')
const SupabaseClubRepository = require('../../repositories/SupabaseClubRepository')

const repo = () => new SupabaseClubRepository()

const crear = async (req, res, next) => {
  try {
    const resultado = await new CrearClub(repo()).ejecutar(req.body, req.usuario.rol)
    res.status(201).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const listar = async (req, res, next) => {
  try {
    const resultado = await new ListarClubes(repo()).ejecutar(req.usuario)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const listarPublico = async (req, res, next) => {
  try {
    const resultado = await repo().listar()
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const obtener = async (req, res, next) => {
  try {
    const resultado = await new ObtenerClub(repo()).ejecutar(req.params.id)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

const actualizar = async (req, res, next) => {
  try {
    const resultado = await new ActualizarClub(repo()).ejecutar(req.params.id, req.body, req.usuario.rol)
    res.status(200).json({ ok: true, data: resultado })
  } catch (e) { next(e) }
}

module.exports = { crear, listar, listarPublico, obtener, actualizar }