const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Usa SSL
      auth: {
        /* user: process.env.EMAIL,
        pass: process.env.PASSWORD */
        user: 'victor.hugo280697@gmail.com',
        pass: 'tcmd ynke nmsv fipd'
      }
    })

    // Verificar autenticação
    await transporter.verify()
    console.log('Autenticação de e-mail bem-sucedida.')

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text
    }

    await transporter.sendMail(mailOptions)
    console.log(`E-mail enviado para: ${to}`)
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
  }
}

module.exports = sendEmail
