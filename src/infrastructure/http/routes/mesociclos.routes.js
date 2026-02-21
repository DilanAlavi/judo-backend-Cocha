const express = require('express')
const router = express.Router()
const {
  listarTodos, listarPorMacrociclo, obtener,
  crear, actualizar, asignarJudoka, quitarJudoka
} = require('../controllers/mesociclos.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

router.get('/todos', rolesMiddleware(['admin', 'asociacion', 'sensei']), listarTodos)
router.get('/macrociclo/:macrocicloId', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), listarPorMacrociclo)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), obtener)
router.post('/', rolesMiddleware(['admin', 'sensei']), crear)
router.put('/:id', rolesMiddleware(['admin', 'sensei']), actualizar)
router.post('/:id/judokas', rolesMiddleware(['admin', 'sensei']), asignarJudoka)
router.delete('/:id/judokas/:judokaId', rolesMiddleware(['admin', 'sensei']), quitarJudoka)

module.exports = router