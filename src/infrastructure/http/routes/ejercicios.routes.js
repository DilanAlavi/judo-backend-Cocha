const express = require('express')
const router = express.Router()
const { listar, obtener, crear, actualizar, desactivar } = require('../controllers/ejercicios.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)
router.get('/', rolesMiddleware(['admin', 'asociacion', 'sensei']), listar)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei']), obtener)
router.post('/', rolesMiddleware(['admin', 'sensei']), crear)
router.put('/:id', rolesMiddleware(['admin', 'sensei']), actualizar)
router.delete('/:id', rolesMiddleware(['admin', 'sensei']), desactivar)

module.exports = router