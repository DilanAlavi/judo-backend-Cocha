const express = require('express')
const cors = require('cors')
const authRoutes = require('./infrastructure/http/routes/auth.routes')
const errorMiddleware = require('./infrastructure/http/middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Judo ADDJC funcionando' })
})

// Manejo de errores (siempre al final)
app.use(errorMiddleware)

module.exports = app