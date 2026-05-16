import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Импортировать глобальные стили
import './theme.css'

// Lucide иконкаларын тіркеу
import * as LucideIcons from 'lucide-vue-next'

const app = createApp(App)

// Барлық иконкаларды глобалды түрде тіркеу
for (const [key, component] of Object.entries(LucideIcons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

// Инициализировать аутентификацию
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')