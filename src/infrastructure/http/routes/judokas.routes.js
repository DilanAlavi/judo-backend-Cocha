const express = require('express')
const router = express.Router()
const { listar, listarSinClub, listarPorClub, obtener, obtenerPorUsuario, actualizarDatos, desactivar, cambiarClub } = require('../controllers/judokas.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

router.get('/', rolesMiddleware(['admin', 'asociacion']), listar)
router.get('/sin-club', rolesMiddleware(['admin', 'asociacion', 'sensei']), listarSinClub)
router.get('/por-usuario/:usuarioId', obtenerPorUsuario)
router.get('/por-club/:clubId', rolesMiddleware(['admin', 'asociacion', 'sensei']), listarPorClub)
router.get('/:id', obtener)
router.put('/:id/datos', rolesMiddleware(['admin', 'asociacion', 'sensei']), actualizarDatos)
router.put('/:judokaId/desactivar', rolesMiddleware(['admin', 'asociacion', 'sensei']), desactivar)
router.put('/:judokaId/cambiar-club', rolesMiddleware(['admin', 'asociacion']), cambiarClub)

module.exports = router