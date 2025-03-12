const express = require('express')
const bcrypt = require('bcrypt') // Para hash de senhas
const User = require('../models/User') // Importa o modelo de usuário
const router = express.Router()

// CREATE - Criar um novo usuário
router.post('/users', async (req, res) => {
  const { name, email, password, type } = req.body

  // Verifica se o e-mail já existe
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({ message: 'E-mail já cadastrado' })
  }

  try {
    // Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const newUser = new User({ name, email, password: hashedPassword, type })
    await newUser.save()

    res
      .status(201)
      .json({ message: 'Usuário criado com sucesso', user: newUser })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao criar usuário', error: error.message })
  }
})

// READ - Obter todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password') // Exclui o campo senha do retorno
    res.status(200).json(users)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao listar usuários', error: error.message })
  }
})

router.get('/users/patients', async (req, res) => {
  try {
    const users = await User.find({ type: 'P' }).select('_id name')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pacientessss.' })
  }
})

// READ - Obter um usuário por ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id, '-password') // Exclui o campo senha do retorno
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao obter usuário', error: error.message })
  }
})

// UPDATE - Atualizar um usuário
router.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, password, type } = req.body

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    // Atualiza os campos fornecidos
    if (name) user.name = name
    if (email) user.email = email
    if (password) {
      user.password = await bcrypt.hash(password, 10) // Atualiza com senha hash
    }
    if (type) user.type = type

    await user.save()
    res.status(200).json({ message: 'Usuário atualizado com sucesso', user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao atualizar usuário', error: error.message })
  }
})

// DELETE - Excluir um usuário
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao excluir usuário', error: error.message })
  }
})

module.exports = router
