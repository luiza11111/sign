import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api'

// デモモードの有効化
const DEMO_MODE = true

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoggedIn = ref(false)
  const token = ref(null)
  const isDemoMode = ref(DEMO_MODE)

  // Тіркелген қолданушылар тізімі (теперь через API)
  const getRegisteredUsers = async () => {
    try {
      const response = await apiClient.get('/api/users', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  const saveRegisteredUsers = async (users) => {
    // Теперь не нужно, так как данные в БД
  }

  // Тіркелу
  const register = async (name, email, password) => {
    try {
      await apiClient.post('/api/register', {
        name,
        email,
        password
      })

      return { success: true, message: 'Тіркелу сәтті! Енді жүйеге кіріңіз.' }
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Қате орын алды' }
    }
  }

  // Кіру
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/login', {
        email,
        password
      })

      user.value = response.data.user
      token.value = response.data.token
      isLoggedIn.value = true

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('isLoggedIn', 'true')

      return { success: true, message: 'Кіру сәтті!', role: response.data.user.role }
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Қате орын алды' }
    }
  }

  // Шығу
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    token.value = null
    
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('inputText') // Очищаем сохраненный текст при выходе
  }

  // Профиль жаңарту
  const updateProfile = async (name, email) => {
    try {
      const response = await apiClient.put(
        '/api/users/me',
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )

      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(user.value))

      return { success: true, message: 'Профиль сақталды' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Профильді сақтау кезінде қате орын алды'
      }
    }
  }

  // Аутентификацияны инициализациялау (бет жүктелгенде)
  const initAuth = () => {
    // デモモード：ダミーユーザーで自動ログイン
    if (DEMO_MODE) {
      user.value = {
        id: 1,
        name: 'Демо пайдаланушы',
        email: 'demo@sign.kz',
        role: 'user'
      }
      token.value = 'demo-token-' + Date.now()
      isLoggedIn.value = true
      
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      localStorage.setItem('isLoggedIn', 'true')
      return
    }
    
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedLogin = localStorage.getItem('isLoggedIn')
    
    if (savedUser && savedToken && savedLogin === 'true') {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      isLoggedIn.value = true
    }
  }

  // Админ екенін тексеру
  const isAdmin = () => {
    return user.value?.role === 'admin'
  }

  // Пайдаланушы атын алу
  const userName = computed(() => {
    return user.value?.name || 'Қонақ'
  })

  // Getters
  const getUser = computed(() => user.value)
  const getIsLoggedIn = computed(() => isLoggedIn.value)

  return { 
    user, 
    isLoggedIn, 
    token,
    isDemoMode,
    register, 
    login, 
    logout, 
    initAuth,
    isAdmin,
    userName,
    getUser,
    getIsLoggedIn
  }
})