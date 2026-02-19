const Registro = require('../../../application/auth/Registro')
const Login = require('../../../application/auth/Login')
const SupabaseUsuarioRepository = require('../../repositories/SupabaseUsuarioRepository')

const registro = async (req, res, next) => {
  try {
    const repository = new SupabaseUsuarioRepository()
    const useCase = new Registro(repository)
    const resultado = await useCase.ejecutar(req.body)
    res.status(201).json({ ok: true, data: resultado })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const repository = new SupabaseUsuarioRepository()
    const useCase = new Login(repository)
    const resultado = await useCase.ejecutar(req.body)
    res.status(200).json({ ok: true, data: resultado })
  } catch (error) {
    next(error)
  }
}

const perfil = async (req, res) => {
  res.status(200).json({ ok: true, data: req.usuario })
}

module.exports = { registro, login, perfil }