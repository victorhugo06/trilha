require('dotenv').config()
const axios = require('axios')
const cron = require('node-cron')
const sendEmail = require('./SendEmail')
const EmailLog = require('../models/EmailLog') // Importa o modelo de log de execução

// Função para buscar eventos do dia
async function fetchEvents() {
  try {
    const response = await axios.get(`http://localhost:5000/api/events`)
    return response.data // Lista de eventos
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return []
  }
}

// Função para buscar email do usuário pelo ID
async function fetchUserEmail(userId) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/${userId}`
    )
    return response.data.email // Retorna o email do usuário
  } catch (error) {
    console.error(`Erro ao buscar e-mail do usuário ${userId}:`, error)
    return null
  }
}

// Função para enviar lembretes
async function sendReminders() {
  try {
    const today = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    const events = await fetchEvents()
    const todaysEvents = events.filter(event =>
      event.date_start.startsWith(today)
    )

    if (todaysEvents.length === 0) {
      console.log('Nenhum evento hoje.')
      return
    }

    const date = []
    const to = []
    const subject = []
    const text = []

    for (const event of todaysEvents) {
      const emails = new Set() // Para evitar duplicados

      // Buscar e-mails dos envolvidos
      if (event.attendant) {
        const email = await fetchUserEmail(event.attendant)
        if (email) emails.add(email)
      }

      if (event.patient) {
        const email = await fetchUserEmail(event.patient)
        if (email) emails.add(email)
      }

      // Enviar e-mails
      for (const email of emails) {
        console.log('enviando..')
        await sendEmail(
          email,
          `Trilha - psicologia comportamental (Lembrete)`,
          `Olá! Este é um lembrete do atendimento "${
            event.title
          }" que ocorre hoje, ás ${new Date(event.date_start).toLocaleString()}`
        )

        to.push(email)
        subject.push(`Lembrete: ${event.title}`)
        text.push(
          `Olá! Este é um lembrete do evento "${
            event.title
          }" que ocorre hoje ás ${new Date(event.date_start).toLocaleString()}`
        )
        date.push(today)
      }
    }

    // Salvar log de execução
    await new EmailLog({
      to,
      subject,
      text,
      date: new Date()
    }).save()
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error)
  }
}

// Agendar a função para rodar todos os dias às 08:00
cron.schedule('0 8 * * *', sendReminders, {
  timezone: 'America/Sao_Paulo'
})

console.log('Rotina de lembretes rodando...')

module.exports = sendReminders
