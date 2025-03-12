// backend/index.js
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/authRoutes') // Importando as rotas de autenticação
const eventsRoutes = require('./routes/eventsRoutes') // Importando as rotas de autenticação
const usersRoutes = require('./routes/usersRoutes') // Importando as rotas de autenticação
const patientsRoutes = require('./routes/patientsRoutes') // Importando as rotas de autenticação
const servicesRoutes = require('./routes/servicesRoutes') // Importando as rotas de autenticação
const uploadsRoutes = require('./routes/uploadsRoutes') // Importando as rotas de autenticação
const emaillogsRoutes = require('./routes/emaillogsRoutes') // Importando as rotas de autenticação
const authenticateToken = require('./middlewares/authMiddleware') // Middleware de autenticação

const app = express()
// Configuração para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors()) // Habilita o CORS
app.use(express.json()) // Para interpretar o corpo da requisição como JSON

// Conectar ao MongoDB
mongoose
  .connect('mongodb://localhost:27017/trilha-db')
  .then(() => {
    console.log('Conectado ao MongoDB')
  })
  .catch(error => {
    console.error('Erro ao conectar no MongoDB:', error)
  })

// Usar as rotas de autenticação
app.use('/api', authRoutes)

// Usar as rotas de eventos (CRUD)
app.use('/api', eventsRoutes) // Adicionando as rotas de eventos

// Usar as rotas de eventos (CRUD)
app.use('/api', usersRoutes) // Adicionando as rotas de usuarios
//app.use('/api/users/', usersRoutes) // Adicionando as rotas de usuarios

// Usar as rotas de eventos (CRUD)
app.use('/api', patientsRoutes) // Adicionando as rotas de pacientes

// Usar as rotas de eventos (CRUD)
app.use('/api', servicesRoutes) // Adicionando as rotas de servicos

app.use('/api', uploadsRoutes) // Adicionando as rotas de servicos

app.use('/api', emaillogsRoutes) // Adicionando as rotas de logs de emails

// Rotas protegidas (autenticadas)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso permitido', user: req.user })
})

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
