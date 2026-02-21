const express = require('express')
const router = express.Router()
const {
  listarTodos, listarPorMesociclo, obtener,
  crear, actualizar, agregarEjercicio,
  actualizarEjercicio, eliminarEjercicio,
  asignarJudoka, quitarJudoka,asignarJudokaEjercicio,quitarJudokaEjercicio
} = require('../controllers/microciclos.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

router.get('/todos', rolesMiddleware(['admin', 'asociacion', 'sensei']), listarTodos)
router.get('/mesociclo/:mesocicloId', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), listarPorMesociclo)
router.get('/:id', rolesMiddleware(['admin', 'asociacion', 'sensei', 'judoka']), obtener)
router.post('/', rolesMiddleware(['sensei']), crear)
router.put('/:id', rolesMiddleware(['sensei']), actualizar)
router.post('/:id/ejercicios', rolesMiddleware(['sensei']), agregarEjercicio)
router.put('/:id/ejercicios/:ejercicioId', rolesMiddleware(['sensei']), actualizarEjercicio)
router.delete('/:id/ejercicios/:ejercicioId', rolesMiddleware(['sensei']), eliminarEjercicio)
router.post('/:id/judokas', rolesMiddleware(['sensei']), asignarJudoka)
router.delete('/:id/judokas/:judokaId', rolesMiddleware(['sensei']), quitarJudoka)
router.post('/:id/ejercicios/:ejercicioId/judokas', rolesMiddleware(['sensei']), asignarJudokaEjercicio)
router.delete('/:id/ejercicios/:ejercicioId/judokas/:judokaId', rolesMiddleware(['sensei']), quitarJudokaEjercicio)

module.exports = router