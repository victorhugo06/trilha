// backend/routes/authRoutes.js
const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken') // Adiciona a dependência para criar/validar JWT
const User = require('../models/User') // Importando o modelo de Usuário
const sendEmail = require('../utils/SendEmail')
const router = express.Router()
const bcrypt = require('bcrypt')

// Rota para login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const secretKey = process.env.SECRET_KEY

  if (!secretKey) {
    throw new Error('SECRET_KEY não está definida no ambiente.')
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' })
  }

  try {
    // Encontrar o usuário pelo e-mail
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' })
    }

    // Comparar a senha fornecida com a senha criptografada
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta.' })
    }

    // Criar o token JWT após login bem-sucedido
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '1h'
    }) // Expira em 1 hora

    // Se o login for bem-sucedido, retornar uma resposta de sucesso
    //res.status(200).json({ message: 'Login bem-sucedido!' })

    // 🔹 Retorne também os dados do usuário!
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        type: user.type
      }
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({ message: 'Erro ao processar sua solicitação.' })
  }
})

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // Verificar se todos os campos foram preenchidos
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Todos os campos são obrigatórios.' })
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar um novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    // Salvar o novo usuário no banco de dados
    await newUser.save()

    // Enviar resposta de sucesso
    res.status(201).json({ message: 'Conta criada com sucesso!' })
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    res.status(500).json({ message: 'Erro ao processar sua solicitação.' })
  }
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    // Gerar token para redefinição de senha
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = Date.now() + 60 * 60 * 1000 // Token válido por 1 hora

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = tokenExpiry
    await user.save()

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

    // Enviar e-mail com o link de redefinição
    await sendEmail(
      user.email,
      'Redefinição de senha',
      `Olá ${user.name},\n\nClique no link abaixo para redefinir sua senha:\n\n${resetUrl}\n\nSe você não solicitou esta ação, ignore este e-mail.`
    )

    res
      .status(200)
      .json({ message: 'E-mail enviado para redefinição de senha.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao processar solicitação.' })
  }
})

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Verifica se o token ainda é válido
    })

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualiza a senha e remove o token
    user.password = hashedPassword // Lembre-se de hash a senha no pre-save do mongoose
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({ message: 'Senha redefinida com sucesso.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao redefinir senha.' })
  }
})

// Rota de logout
router.post('/logout', (req, res) => {
  // Aqui, você pode simplesmente enviar uma resposta indicando que o logout foi bem-sucedido
  // Para sistemas baseados em JWT, o logout é feito no cliente removendo o token.
  res.status(200).json({ message: 'Logout bem-sucedido!' })
})

module.exports = router
