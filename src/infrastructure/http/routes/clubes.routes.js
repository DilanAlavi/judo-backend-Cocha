const express = require('express')
const router = express.Router()
const { crear, listar, listarPublico, obtener, actualizar } = require('../controllers/clubes.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

// Ruta publica para registro
router.get('/publico', listarPublico)

router.use(authMiddleware)
router.get('/', listar)
router.get('/:id', obtener)
router.post('/', rolesMiddleware(['admin', 'asociacion']), crear)
router.put('/:id', rolesMiddleware(['admin', 'asociacion']), actualizar)

module.exports = router