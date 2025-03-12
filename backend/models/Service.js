const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema(
  {
    treatmentType: {
      type: String,
      required: true
    },
    periodicity: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Service', ServiceSchema)
