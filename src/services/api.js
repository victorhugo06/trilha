import axios from 'axios'

// Configurar a instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Substitua pelo URL correto do seu backend
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para incluir o token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // Obtém o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptar requisições para adicionar o token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // Obter o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
