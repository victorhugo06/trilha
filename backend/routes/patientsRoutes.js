const express = require('express')
const Patient = require('../models/Patient') // Importa o modelo de usuário
const mongoose = require('mongoose')
const upload = require('../middlewares/uploads') // Importa a configuração do multer
const User = require('../models/User')
const Upload = require('../models/Uploads')
const router = express.Router()

// 🔹 Listar todos os pacientes
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({})
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pacientes' })
  }
})

// Rota para obter um paciente específico e seus anexos
router.get('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params
    const patient = await Patient.findById(id).populate('user')
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' })
    }

    const uploads = await Upload.find({ user: patient.user })
    res.status(200).json({ patient, uploads })
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    res
      .status(500)
      .json({ message: 'Erro ao buscar paciente', error: error.message })
  }
})

router.post('/patients', upload.array('attachments', 10), async (req, res) => {
  try {
    const { user, name, treatmentType, description } = req.body

    // Verifica se treatmentType é um array e converte para ObjectId
    if (!Array.isArray(treatmentType)) {
      return res
        .status(400)
        .json({ message: 'treatmentType deve ser um array.' })
    }

    if (!user) {
      return res.status(404).json({ message: 'Paciente não encontrado' })
    }

    const newAttachments = req.files.map(file => file.filename)

    // Criar novo paciente
    const newPatient = new Patient({
      user,
      name,
      treatmentType, // Agora são ObjectId válidos
      description,
      attachments: newAttachments // Assumindo que o modelo de paciente tem essa propriedade
    })

    await newPatient.save()

    // Salva os arquivos no banco de dados
    const uploadPromises = req.files.map(file => {
      const newUpload = new Upload({
        user: user,
        filename: file.filename
      })
      return newUpload.save()
    })

    await Promise.all(uploadPromises)

    res.status(201).json({ message: 'Paciente e anexos criados com sucesso!' })
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error)
    res
      .status(500)
      .json({ message: 'Erro ao cadastrar paciente', error: error.message })
  }
})

// 🔹 Atualizar paciente
// Rota para atualizar um paciente
router.put(
  '/patients/:id',
  upload.array('attachments', 10),
  async (req, res) => {
    try {
      const { id } = req.params
      const { user, name, description, treatmentType } = req.body

      const patient = await Patient.findByIdAndUpdate(
        id,
        {
          user,
          name,
          description,
          treatmentType
        },
        { new: true }
      )

      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' })
      }

      // Atualiza os anexos
      if (req.files) {
        const uploadPromises = req.files.map(file => {
          const newUpload = new Upload({
            user: user,
            filename: file.filename
          })
          return newUpload.save()
        })

        await Promise.all(uploadPromises)
      }

      res
        .status(200)
        .json({ message: 'Paciente atualizado com sucesso', patient })
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error)
      res
        .status(500)
        .json({ message: 'Erro ao atualizar paciente', error: error.message })
    }
  }
)

// 🔹 Excluir paciente
router.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id)
    res.json({ message: 'Paciente excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir paciente' })
  }
})

// Rota para excluir um paciente
/* router.delete('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    // Exclui os anexos associados
    const uploads = await Upload.find({ user: patient.user });
    const deletePromises = uploads.map(upload => {
      const filePath = path.join(__dirname, '..', 'uploads', upload.filename);
      return new Promise((resolve, reject) => {
        fs.unlink(filePath, async (err) => {
          if (err) {
            console.error('Erro ao excluir arquivo:', err);
            return reject(err);
          }
          await upload.remove();
          resolve();
        });
      });
    });

    await Promise.all(deletePromises);

    res.status(200).json({ message: 'Paciente e anexos excluídos com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    res.status(500).json({ message: 'Erro ao excluir paciente', error: error.message });
  }
}); */

module.exports = router
