const express = require('express')
const router = express.Router()
const { listarPorMacrociclo, obtener, crear, actualizar } = require('../controllers/mesociclos.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)
router.get('/macrociclo/:macrocicloId', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), listarPorMacrociclo)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), obtener)
router.post('/', rolesMiddleware(['admin', 'sensei']), crear)
router.put('/:id', rolesMiddleware(['admin', 'sensei']), actualizar)

module.exports = router