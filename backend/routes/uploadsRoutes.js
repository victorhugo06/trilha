const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploads') // Middleware de upload
const Upload = require('../models/Uploads') // Modelo de Upload
const fs = require('fs')
const path = require('path')

// Rota para obter todos os uploads de um usuário
router.get('/uploads/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const uploads = await Upload.find({ user: userId })
    res.status(200).json(uploads)
  } catch (error) {
    console.error('Erro ao buscar uploads:', error)
    res
      .status(500)
      .json({ message: 'Erro ao buscar uploads', error: error.message })
  }
})

// Rota para upload de arquivos
router.post('/uploads', upload.array('files', 10), async (req, res) => {
  try {
    const userId = req.body.userId // Supondo que o ID do usuário é enviado no corpo da requisição

    const uploadPromises = req.files.map(file => {
      const newUpload = new Upload({
        user: userId,
        filename: file.filename
      })
      return newUpload.save()
    })

    await Promise.all(uploadPromises)

    res.status(200).json({ message: 'Arquivos enviados e salvos com sucesso!' })
  } catch (error) {
    console.error('Erro ao salvar arquivos:', error)
    res
      .status(500)
      .json({ message: 'Erro ao salvar arquivos', error: error.message })
  }
})

// Rota para excluir um upload
router.delete('/uploads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const upload = await Upload.findById(id)

    if (!upload) {
      return res.status(404).json({ message: 'Arquivo não encontrado' })
    }

    // Remove o arquivo do sistema de arquivos
    const filePath = path.join(__dirname, '..', 'uploads', upload.filename)
    fs.unlink(filePath, async err => {
      if (err) {
        console.error('Erro ao excluir arquivo:', err)
        return res
          .status(500)
          .json({ message: 'Erro ao excluir arquivo', error: err.message })
      }

      // Remove o registro do banco de dados
      await upload.remove()
      res.status(200).json({ message: 'Arquivo excluído com sucesso' })
    })
  } catch (error) {
    console.error('Erro ao excluir upload:', error)
    res
      .status(500)
      .json({ message: 'Erro ao excluir upload', error: error.message })
  }
})

module.exports = router
