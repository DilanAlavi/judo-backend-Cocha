const express = require('express')
const router = express.Router()
const {
  listarPorMesociclo,
  listarPorJudoka,
  obtener,
  crear,
  actualizar,
  guardarTest
} = require('../controllers/tests_fisicos.controller')
const authMiddleware  = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

// Listar tests por mesociclo (para la tabla principal)
router.get(
  '/mesociclo/:mesocicloId',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  listarPorMesociclo
)

// Listar todos los tests de un judoka (historial)
router.get(
  '/judoka/:judokaId',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  listarPorJudoka
)

// Obtener un test por ID
router.get(
  '/:id',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  obtener
)

// Crear nuevo test
router.post(
  '/',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  crear
)

// Actualizar test por ID
router.put(
  '/:id',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  actualizar
)

// Guardar test (crear o actualizar) por judoka + mesociclo
router.put(
  '/judoka/:judokaId/mesociclo/:mesocicloId',
  rolesMiddleware(['admin', 'asociacion', 'sensei']),
  guardarTest
)

module.exports = router
