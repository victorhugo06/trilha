const express = require('express')
const router = express.Router()
const EmailLog = require('../models/EmailLog') // Importa o modelo de log de e-mail
const sendReminders = require('../utils/ReminderEvents') // Importa a função de lembretes

// Função para enviar e-mails e salvar logs
async function sendEmail(to, subject, text) {
  try {
    // Lógica de envio de e-mail
    console.log(`Enviando e-mail para ${to} com assunto "${subject}"`)
    // Simulação de envio de e-mail

    // Salvar log no banco de dados
    const emailLog = new EmailLog({ to, subject, text })
    await emailLog.save()
  } catch (error) {
    console.error(`Erro ao enviar e-mail para ${to}:`, error)
  }
}

// Endpoint para executar a rotina manualmente
router.post('/run-reminders', async (req, res) => {
  try {
    await sendReminders()
    res
      .status(200)
      .json({ message: 'Rotina de lembretes executada com sucesso!' })
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao executar rotina de lembretes',
      error: error.message
    })
  }
})

// Endpoint para obter relatório de e-mails enviados
router.get('/email-logs', async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ date: -1 }) // Ordena por data decrescente
    res.status(200).json(logs)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao buscar logs de e-mails', error: error.message })
  }
})

module.exports = router
