// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] // Pega o token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado.' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token expirado ou inválido.' })
    }
    req.user = user // Adiciona os dados do usuário decodificados à requisição
    next() // Continua para a próxima etapa
  })
}

module.exports = authenticateToken
