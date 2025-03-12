// backend/models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Definição do esquema para o modelo de Usuário
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true // Cria automaticamente campos "createdAt" e "updatedAt"
  }
)

// Hash de senha antes de salvar
/* userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
}) */

// Não redefina o modelo se ele já estiver compilado
module.exports = mongoose.models.User || mongoose.model('User', userSchema)
