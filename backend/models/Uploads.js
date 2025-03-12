const mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia a tabela User
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Upload', UploadSchema)
