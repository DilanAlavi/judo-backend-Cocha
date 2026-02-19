const express = require('express')
const router = express.Router()
const { asignar, cambiarClub, desactivar, historial } = require('../controllers/atletasClub.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rolesMiddleware = require('../middlewares/roles.middleware')

router.use(authMiddleware)

router.post('/asignar', rolesMiddleware(['admin', 'asociacion', 'sensei']), asignar)
router.put('/cambiar-club/:judokaId', rolesMiddleware(['admin', 'asociacion', 'sensei']), cambiarClub)
router.put('/desactivar/:judokaId', rolesMiddleware(['admin', 'asociacion', 'sensei']), desactivar)
router.get('/historial/:judokaId', historial)

module.exports = router