import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoggedIn = ref(false)
  const token = ref(null)

  // Админ аккаунты (симуляция)
  const adminAccount = {
    id: 999,
    name: "Админ",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  }

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
      const response = await apiClient.post('/api/register', {
        name,
        email,
        password
      })

      return { success: true, message: 'Тіркелу сәтті! Кіру бетіне өтіңіз.' }
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Қате орын алды' }
    }
  }

  // Кіру
  const login = async (email, password) => {
    try {
      if (email === adminAccount.email && password === adminAccount.password) {
        setAdminSession()
        return { success: true, message: 'Кіру сәтті!', role: 'admin' }
      }

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

  const setAdminSession = () => {
    user.value = { ...adminAccount }
    token.value = 'admin-token'
    isLoggedIn.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', token.value)
    localStorage.setItem('isLoggedIn', 'true')
  }

  // Аутентификацияны инициализациялау (бет жүктелгенде)
  const initAuth = () => {
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