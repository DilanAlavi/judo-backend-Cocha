const express = require('express')
const cors = require('cors')
const authRoutes = require('./infrastructure/http/routes/auth.routes')
const clubesRoutes = require('./infrastructure/http/routes/clubes.routes')
const judokasRoutes = require('./infrastructure/http/routes/judokas.routes')
const atletasClubRoutes = require('./infrastructure/http/routes/atletasClub.routes')
const errorMiddleware = require('./infrastructure/http/middlewares/error.middleware')
const ejerciciosRoutes = require('./infrastructure/http/routes/ejercicios.routes')
const macrociclosRoutes = require('./infrastructure/http/routes/macrociclos.routes')
const mesociclosRoutes = require('./infrastructure/http/routes/mesociclos.routes')
const microciclosRoutes = require('./infrastructure/http/routes/microciclos.routes')
const testsFisicosRoutes = require('./infrastructure/http/routes/tests_fisicos.routes')
const app = express()

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://judo-frontend-cocha-7dju.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS bloqueado: ${origin}`))
    }
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clubes', clubesRoutes)
app.use('/api/judokas', judokasRoutes)
app.use('/api/atletas-club', atletasClubRoutes)
app.use('/api/ejercicios', ejerciciosRoutes)
app.use('/api/macrociclos', macrociclosRoutes)
app.use('/api/mesociclos', mesociclosRoutes)
app.use('/api/microciclos', microciclosRoutes)
app.use('/api/tests-fisicos', testsFisicosRoutes)
app.get('/', (req, res) => res.json({ ok: true, mensaje: 'API Judo ADDJC funcionando' }))

app.use(errorMiddleware)

module.exports = app