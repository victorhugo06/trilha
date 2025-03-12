const express = require('express')
const Event = require('../models/Event')
const router = express.Router()
const sendEmail = require('../utils/SendEmail')
const mongoose = require('mongoose')
const User = require('../models/User') // Atualize o caminho conforme necessário

// Create Event
router.post('/events', async (req, res) => {
  const {
    title,
    description,
    attendant,
    patient,
    date_start,
    date_end,
    frequency,
    repetitions
  } = req.body

  if (
    !patient.every(id => mongoose.Types.ObjectId.isValid(id)) ||
    !attendant.every(id => mongoose.Types.ObjectId.isValid(id))
  ) {
    return res
      .status(400)
      .json({ message: 'IDs inválidos para paciente ou atendente.' })
  }

  // Validação das datas
  let validDateStart = date_start ? new Date(date_start) : null
  let validDateEnd = date_end ? new Date(date_end) : null

  const createDateFuture = (startDate, frequency, count) => {
    const date = new Date(startDate)
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + count)
        break
      case 'weekly':
        date.setDate(date.getDate() + count * 7)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + count)
        break
      case 'twomonthly':
        date.setMonth(date.getMonth() + count)
        break
      case 'threemonthly':
        date.setMonth(date.getMonth() + count)
        break
      case 'sixmonthly':
        date.setMonth(date.getMonth() + count)
        break
      default:
        break
    }
    return date
  }

  const events = []
  const repeatCount = repetitions || 1 // Se não for fornecido, cria apenas um evento
  for (let i = 0; i < repeatCount; i++) {
    const newStartDate = createDateFuture(validDateStart, frequency, i)
    const newEndDate = createDateFuture(validDateEnd, frequency, i)

    events.push({
      title,
      description,
      attendant,
      patient,
      date_start: newStartDate,
      date_end: newEndDate
    })
  }

  const attendantsEmails = await User.find({ _id: { $in: attendant } })
    .select('email')
    .lean()
  const patientsEmails = await User.find({ _id: { $in: patient } })
    .select('email')
    .lean()

  const emails = [
    ...attendantsEmails.map(a => a.email),
    ...patientsEmails.map(p => p.email)
  ]

  try {
    await Event.insertMany(events) // Cria múltiplos eventos de uma vez
    res.status(201).json(events)

    // Enviar notificação por e-mail
    await Promise.all(
      emails.map(email =>
        sendEmail(
          email,
          'Trilha - Psicologia comportamental',
          `Agendamento criado\nOlá, gostariamos de informar que o atendimento: ${title}. Foi agendado.\nDescrição: ${description}.\nData: ${new Date(
            date_start
          ).toLocaleString()} - ${new Date(date_end).toLocaleString()}`
        )
      )
    )
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar evento', error })
  }
})

// Get all Events
router.get('/events', async (req, res) => {
  const { patient, attendant } = req.query

  const filter = {}
  if (patient) filter.patient = { $in: [patient] } // Para garantir a correspondência com arrays
  if (attendant) filter.attendant = { $in: [attendant] } // Para garantir a correspondência com arrays

  try {
    const events = await Event.find(filter)
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar eventos', error })
  }
})

// Update Event
router.put('/events/:id', async (req, res) => {
  const { id } = req.params
  const { title, description, date_start, date_end, attendant, patient } =
    req.body

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date_start, date_end },
      { new: true }
    )

    // Buscar os e-mails dos envolvidos
    const attendantEmails = await User.find({
      _id: { $in: attendant }
    }).select('email')
    const patientEmails = await User.find({ _id: { $in: patient } }).select(
      'email'
    )

    // Combinar todos os e-mails em um único array
    const emails = [
      ...attendantEmails.map(user => user.email),
      ...patientEmails.map(user => user.email)
    ]

    // Enviar notificações por e-mail
    await Promise.all(
      emails.map(email =>
        sendEmail(
          email,
          'Trilha - Psicologia comportamental',
          `Agendamento atualizado.\nO agendamento "${title}" foi atualizado.\n\nDescrição: ${description}.\nData: ${new Date(
            date_start
          ).toLocaleString()} - ${new Date(date_end).toLocaleString()}`
        )
      )
    )
    res.status(200).json(updatedEvent)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar evento', error })
  }
})

// Delete Event
router.delete('/events/:id', async (req, res) => {
  const { id } = req.params

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' })
    }

    // Verifica se o evento está a menos de 24 horas da data marcada
    const eventDate = new Date(event.date_start) // Supondo que o campo seja `date`
    const now = new Date()
    const hoursDifference = (eventDate - now) / (1000 * 60 * 60) // Converter para horas

    if (hoursDifference < 24) {
      return res.status(400).json({
        error:
          'O evento só pode ser excluído com pelo menos 24 horas de antecedência.'
      })
    }

    await Event.findByIdAndDelete(id)
    res.status(200).json({ message: 'Evento excluído com sucesso' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar o evento.' })
  }
})

router.post('/events/check', async (req, res) => {
  const { attendants, patients, date_start, date_end } = req.body

  try {
    const existingEvent = await Event.findOne({
      attendant: { $in: attendants },
      patient: { $in: patients },
      date_start: { $lte: new Date(date_end) },
      date_end: { $gte: new Date(date_start) }
    })

    if (existingEvent) {
      return res.json({ exists: true })
    }

    res.json({ exists: false })
  } catch (error) {
    console.error('Error checking event:', error)
    res.status(500).send('Erro ao verificar evento.')
  }
})

module.exports = router
