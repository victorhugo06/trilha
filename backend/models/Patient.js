const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia a tabela User
      required: true
    },
    name: {
      type: String,
      required: true
    },
    treatmentType: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Service', // Referencia a tabela User
      required: true
    },
    description: {
      type: String, // Pode ser um enum se houver tipos predefinidos
      required: true
    },
    attachments: {
      type: [String], // Array de strings para armazenar URLs ou caminhos de arquivos
      default: [] // Valor padrão como array vazio
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Patient', PatientSchema)
