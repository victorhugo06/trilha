const express = require('express')
const Service = require('../models/Service') // Importa o modelo de usuário
const router = express.Router()

// 🔹 Listar todos os servicos
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({})
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar planos' })
  }
})

// 🔹 Criar um servico
router.post('/services', async (req, res) => {
  try {
    const { treatmentType, periodicity } = req.body
    console.log(req.body)
    const newService = new Service({ treatmentType, periodicity })
    await newService.save()
    res.status(201).json(newService)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar serviço' })
  }
})

// 🔹 Atualizar servico
router.put('/services/:id', async (req, res) => {
  try {
    const { treatmentType, periodicity } = req.body
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { treatmentType, periodicity },
      { new: true }
    )
    res.json(updatedService)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar servico' })
  }
})

// 🔹 Excluir servico
router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id)
    res.json({ message: 'Servico excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir servico' })
  }
})

module.exports = router
