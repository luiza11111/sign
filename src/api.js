// src/api.js
import axios from 'axios'

// ---------- Қолданыстағы API (Node.js сервері, порт 3002) ----------
const defaultApiUrl = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'http://localhost:3002')

const API_BASE_URL = defaultApiUrl

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Токенді заголовкаға қосу (авторизация үшін)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------- Python API (Ымдау тілі видеолары) ----------
// Use relative /api paths by default so Vite dev proxy can forward requests to the Python backend.
// To override, set VITE_PYTHON_API_URL in your environment (e.g. when calling a remote server).
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || ''

const pythonApiClient = axios.create({
  baseURL: PYTHON_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ---------- Экспорттар ----------
export default apiClient

// Python API арнайы функциялары
export const pythonApi = {
  /**
   * Орыс мәтінін жіберіп, видеоларды өңдеу
   * @param {string} text - Орыс тіліндегі мәтін
   * @returns {Promise} - { job_id, results, total_words, downloaded }
   */
  async translateToSign(text) {
    try {
      const response = await pythonApiClient.post('/api/process', { text })
      return response.data
    } catch (error) {
      console.error('Python API қатесі:', error)
      throw error
    }
  },

  /**
   * Бір сөздің видеосын жүктеу URL-і
   * @param {string} job_id - Жұмыс идентификаторы
   * @param {string} word - Сөз (мысалы: привет)
   * @returns {string} - Видео сілтемесі
   */
  getVideoDownloadUrl(job_id, word) {
    return `${PYTHON_API_URL || ''}/api/download/${job_id}/${encodeURIComponent(word)}`
  },

  /**
   * Барлық видеоларды ZIP архивке жүктеу URL-і
   * @param {string} job_id - Жұмыс идентификаторы
   * @returns {string} - ZIP файл сілтемесі
   */
  getDownloadAllUrl(job_id) {
    return `${PYTHON_API_URL || ''}/api/download-all/${job_id}`
  },

  /**
   * Жұмыс күйін тексеру
   * @param {string} job_id 
   * @returns {Promise}
   */
  async getJobStatus(job_id) {
    const response = await pythonApiClient.get(`/api/status/${job_id}`)
    return response.data
  },

  /**
   * Уақытша файлдарды өшіру
   * @param {string} job_id 
   */
  async cleanupJob(jobId) {
    try {
      await pythonApiClient.delete(`/api/cleanup/${jobId}`)
    } catch (e) {
      console.warn('Cleanup қатесі:', e)
    }
  }
}