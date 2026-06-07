import axios from 'axios'

const defaultApiUrl = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'http://localhost:3002')

const API_BASE_URL = defaultApiUrl

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true - Бұл жолды өшірдік
})

// Добавить токен к заголовкам если он существует
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
