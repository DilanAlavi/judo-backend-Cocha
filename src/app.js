const express = require('express')
const cors = require('cors')
const authRoutes = require('./infrastructure/http/routes/auth.routes')
const clubesRoutes = require('./infrastructure/http/routes/clubes.routes')
const judokasRoutes = require('./infrastructure/http/routes/judokas.routes')
const atletasClubRoutes = require('./infrastructure/http/routes/atletasClub.routes')
const errorMiddleware = require('./infrastructure/http/middlewares/error.middleware')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clubes', clubesRoutes)
app.use('/api/judokas', judokasRoutes)
app.use('/api/atletas-club', atletasClubRoutes)

app.get('/', (req, res) => res.json({ ok: true, mensaje: 'API Judo ADDJC funcionando' }))

app.use(errorMiddleware)

module.exports = app