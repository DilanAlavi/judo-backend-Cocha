const express = require('express')
const router = express.Router()
const { listar, obtener, crear, actualizar, asignarJudoka, quitarJudoka } = require('../controllers/macrociclos.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)
router.get('/', rolesMiddleware(['admin', 'asociacion', 'sensei']), listar)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), obtener)
router.post('/', rolesMiddleware(['admin', 'sensei']), crear)
router.put('/:id', rolesMiddleware(['admin', 'sensei']), actualizar)
router.post('/:id/judokas', rolesMiddleware(['admin', 'sensei']), asignarJudoka)
router.delete('/:id/judokas/:macrocicloJudokaId', rolesMiddleware(['admin', 'sensei']), quitarJudoka)

module.exports = router