// backend/models/User.js
const mongoose = require('mongoose')

// Definição do esquema para o modelo de Usuário
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    attendant: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true
    },
    patient: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true
    },
    date_start: {
      type: Date,
      default: null
    },
    date_end: {
      type: Date,
      default: null
    },
    createdBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  {
    timestamps: true // Cria automaticamente campos "createdAt" e "updatedAt"
  }
)

// Não redefina o modelo se ele já estiver compilado
module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema)
