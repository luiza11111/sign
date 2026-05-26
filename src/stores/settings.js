import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Состояние - тёмный режим по умолчанию выключен
  const language = ref('kk')
  const darkMode = ref(false)
  const notifications = ref(true)

  // Инициализация из localStorage
  const initSettings = () => {
    const savedLanguage = localStorage.getItem('appLanguage') || 'kk'
    const savedDarkMode = localStorage.getItem('appDarkMode') === 'true'
    const savedNotifications = localStorage.getItem('appNotifications') !== 'false'

    language.value = savedLanguage
    darkMode.value = savedDarkMode
    notifications.value = savedNotifications

    applyTheme()
    document.documentElement.lang = language.value
  }

  // Применить тёмный режим
  const applyTheme = () => {
    const root = document.documentElement
    if (darkMode.value) {
      root.classList.add('dark-theme')
      document.body.classList.add('dark-theme')
    } else {
      root.classList.remove('dark-theme')
      document.body.classList.remove('dark-theme')
    }
  }

  // Переключатель тёмного режима
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('appDarkMode', darkMode.value)
    applyTheme()
    return darkMode.value
  }

  // Установка языка
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('appLanguage', lang)
    document.documentElement.lang = lang
    // Загрузить соответствующие переводы
    return lang
  }

  // Переключатель уведомлений
  const toggleNotifications = () => {
    notifications.value = !notifications.value
    localStorage.setItem('appNotifications', notifications.value)
    return notifications.value
  }

  // Слежение за изменениями
  watch(darkMode, (newVal) => {
    localStorage.setItem('appDarkMode', newVal)
    applyTheme()
  })

  watch(language, (newVal) => {
    localStorage.setItem('appLanguage', newVal)
    document.documentElement.lang = newVal
  })

  watch(notifications, (newVal) => {
    localStorage.setItem('appNotifications', newVal)
  })

  return {
    language,
    darkMode,
    notifications,
    initSettings,
    applyTheme,
    toggleDarkMode,
    setLanguage,
    toggleNotifications
  }
})
