import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const isEnabled = ref(true)

  const addNotification = (message, type = 'info', duration = 3000) => {
    if (!isEnabled.value) return

    const id = Date.now()
    const notification = {
      id,
      message,
      type, // 'info', 'success', 'warning', 'error'
      timestamp: new Date()
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearAll = () => {
    notifications.value = []
  }

  const toggleNotifications = (enabled) => {
    isEnabled.value = enabled
    localStorage.setItem('appNotifications', enabled)
  }

  const initNotifications = () => {
    const saved = localStorage.getItem('appNotifications')
    if (saved !== null) {
      isEnabled.value = saved === 'true'
    }
  }

  return {
    notifications,
    isEnabled,
    addNotification,
    removeNotification,
    clearAll,
    toggleNotifications,
    initNotifications
  }
})
