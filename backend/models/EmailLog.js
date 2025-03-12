const mongoose = require('mongoose')

const emailLogSchema = new mongoose.Schema({
  to: [{ type: String }], // Aceita um array de strings
  subject: [{ type: String }], // Aceita um array de strings
  text: [{ type: String }], // Aceita um array de strings
  date: { type: Date, default: Date.now }
})

const EmailLog = mongoose.model('EmailLog', emailLogSchema)

module.exports = EmailLog
