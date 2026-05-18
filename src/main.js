import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

import './theme.css'

// i18n импорттау
import { t, setLanguage, currentLanguage, translatePage, loadLanguage } from './i18n'

// Lucide иконкалары
import * as LucideIcons from 'lucide-vue-next'

// APP құру
const app = createApp(App)

// Глобальды функциялар
app.config.globalProperties.$t = t
app.config.globalProperties.$setLanguage = setLanguage
app.config.globalProperties.$currentLanguage = currentLanguage

// Иконкаларды тіркеу
for (const [key, component] of Object.entries(LucideIcons)) {
  app.component(key, component)
}

// Плагиндер
app.use(createPinia())
app.use(router)

// Қосымшаны монтировкалау
app.mount('#app')

// Аутентификацияны инициализациялау
const authStore = useAuthStore()
authStore.initAuth()

// Тілді жүктеу және бетті аудару
loadLanguage()
translatePage()

// Тіл өзгергенде бетті аудару
window.addEventListener('languageChanged', () => {
  translatePage()
})