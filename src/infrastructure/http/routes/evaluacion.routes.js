const express = require('express')
const router = express.Router()
const {
  listarParaSensei, cambiarEstado, guardarNota,
  misEvaluaciones, guardarComentarioJudoka, listarAdmin
} = require('../controllers/evaluacion.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

// Sensei
router.get('/sensei/microciclos', rolesMiddleware(['sensei']), listarParaSensei)
router.put('/microciclos/:id/estado', rolesMiddleware(['sensei']), cambiarEstado)
router.put('/notas', rolesMiddleware(['sensei']), guardarNota)

// Judoka
router.get('/judoka/mis-evaluaciones', rolesMiddleware(['judoka']), misEvaluaciones)
router.put('/judoka/comentario', rolesMiddleware(['judoka']), guardarComentarioJudoka)

// Admin / Asociacion
router.get('/admin/todas', rolesMiddleware(['admin', 'asociacion']), listarAdmin)

module.exports = router