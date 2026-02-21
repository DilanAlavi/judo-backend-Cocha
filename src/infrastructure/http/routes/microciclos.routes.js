const express = require('express')
const router = express.Router()
const {
  listarPorMesociclo, obtener, crear, actualizar,
  agregarEjercicio, actualizarEjercicio, eliminarEjercicio,
  asignarJudoka, quitarJudoka
} = require('../controllers/microciclos.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)
router.get('/mesociclo/:mesocicloId', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), listarPorMesociclo)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), obtener)
router.post('/', rolesMiddleware(['admin', 'sensei']), crear)
router.put('/:id', rolesMiddleware(['admin', 'sensei', 'judoka']), actualizar)
router.post('/:id/ejercicios', rolesMiddleware(['admin', 'sensei']), agregarEjercicio)
router.put('/:id/ejercicios/:ejercicioId', rolesMiddleware(['admin', 'sensei', 'judoka']), actualizarEjercicio)
router.delete('/:id/ejercicios/:ejercicioId', rolesMiddleware(['admin', 'sensei']), eliminarEjercicio)
router.post('/:id/judokas', rolesMiddleware(['admin', 'sensei']), asignarJudoka)
router.delete('/:id/judokas/:judokaId', rolesMiddleware(['admin', 'sensei']), quitarJudoka)

module.exports = router