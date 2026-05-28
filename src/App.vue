<template>
  <div id="app">
    <!-- Компонент уведомлений -->
    <NotificationsContainer />

    <!-- Егер қолданушы кірген болса, Sidebar және мазмұн көрсетіледі -->
    <div v-if="isLoggedIn" class="app-layout">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
      
      <!-- ТҰРАҚТЫ ФЛОАТТЫ БАТЫРМА (БАРЛЫҚ БЕТТЕРДЕ) -->
      <div class="resources-float">
        <button class="float-btn" @click="showResourcesModal = true">
          <span class="float-icon">📚</span>
          <span class="float-text" data-i18n="resources">Ресурстар</span>
        </button>
        
        <!-- Модальды терезе - ТОЛЫҚ ЖҰМЫС ІСТЕЙТІН СІЛТЕМЕЛЕР -->
        <div v-if="showResourcesModal" class="modal-overlay" @click="showResourcesModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <div class="modal-title">
                <span>📚</span>
                <span data-i18n="resources_title">Көмекші ресурстар</span>
              </div>
              <button class="modal-close" @click="showResourcesModal = false">✕</button>
            </div>
            <div class="modal-body">
              <!-- Біріктірілген ресурс: Алфавит және Негіздері -->
              <a
                href="#"
                class="modal-item"
                @click.prevent="openResource('combined')"
              >
                <span class="modal-item-icon">📖</span>
                <div class="modal-item-info">
                  <strong>Алфавит және негіздері</strong>
                  <small>Символдар, қол қимылдары және негізгі сөздер</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>

              <!-- 3. Бейне сабақтар - YouTube -->
              <a 
                href="https://youtu.be/h6ukdwq-D6o?si=GS9sxsavCmGL3bSI" 
                class="modal-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="modal-item-icon">🎥</span>
                <div class="modal-item-info">
                  <strong>Бейне сабақтар</strong>
                  <small>Видео нұсқаулықтар жинағы</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>

              <!-- 3. Мобильді қосымша - Google Play -->
              <a 
                href="https://play.google.com/store/apps/details?id=com.signflow.app" 
                class="modal-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="modal-item-icon">📱</span>
                <div class="modal-item-info">
                  <strong>Мобильді қосымша</strong>
                  <small>Android және iOS нұсқалары</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>

              <!-- 4. Telegram бот -->
              <a 
                href="https://t.me/QazaqSignBot" 
                class="modal-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="modal-item-icon">💬</span>
                <div class="modal-item-info">
                  <strong>Telegram бот</strong>
                  <small>Күнделікті жаттығулар</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>

              <!-- 5. Қауымдастық форум - Discord -->
              <a 
                href="https://discord.gg/signflow" 
                class="modal-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="modal-item-icon">🌐</span>
                <div class="modal-item-info">
                  <strong>Қауымдастық форум</strong>
                  <small>Пікірлер мен сұрақтар</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>

              <!-- 6. PDF нұсқаулық -->
              <a 
                href="/files/signflow-user-guide.pdf" 
                class="modal-item"
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent="openResource('pdf', 'signflow-user-guide')"
              >
                <span class="modal-item-icon">📄</span>
                <div class="modal-item-info">
                  <strong>PDF нұсқаулық</strong>
                  <small>Жүктеп алуға арналған</small>
                </div>
                <span class="modal-item-arrow">→</span>
              </a>
            </div>
            <div class="modal-footer">
              <button class="footer-btn" @click="showResourcesModal = false">
                Жабу
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI КӨМЕКШІ БОТ -->
      <ChatBot />
    </div>
    
    <!-- Кірмеген қолданушыға Sidebar көрсетілмейді -->
    <div v-else class="auth-layout">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'
import { useNotificationsStore } from './stores/notifications'
import Sidebar from './components/Sidebar.vue'
import NotificationsContainer from './components/NotificationsContainer.vue'
import ChatBot from './components/ChatBot.vue'

// i18n функцияларын импорттау
import { loadLanguage, translatePage, currentLanguage, setLanguage, t } from './i18n'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const notificationsStore = useNotificationsStore()
const router = useRouter()
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Модальды терезе
const showResourcesModal = ref(false)

// Ресурстарды ашу функциясы

// Біріктірілген ресурс үшін қысқаша өңдеу
const openCombinedResource = () => {
  // Ашылатын бет: Алфавит бөлімін көрсетеміз
  router.push('/alphabet')
  showResourcesModal.value = false
}

// Қолданыстағы функцияны кеңейту: 'combined' түрін өңдеу
const openResource = (type, name) => {
  if (type === 'combined') {
    return openCombinedResource()
  }
  if (type === 'pdf') {
    const url = name === 'kazakh-sign-language-basics'
      ? '/files/kazakh-sign-language-basics.pdf'
      : '/files/signflow-user-guide.pdf'
    window.open(url, '_blank', 'noopener')
    showResourcesModal.value = false
  }
  if (type === 'alphabet') {
    router.push('/alphabet')
    showResourcesModal.value = false
  }
}

// ========== ТІЛДІ БАСТАПҚЫ ЖҮКТЕУ ==========
const initLanguage = () => {
  loadLanguage()
  const lang = currentLanguage.value || 'kk'
  document.documentElement.setAttribute('lang', lang)
  translatePage()
  
  const handleLanguageChange = (event) => {
    const newLang = event.detail
    document.documentElement.setAttribute('lang', newLang)
    translatePage()
  }
  
  window.addEventListener('languageChanged', handleLanguageChange)
  console.log('Тіл жүктелді:', lang)
}

// ========== ҚАРАҢҒЫ РЕЖИМДІ ИНИЦИАЛИЗАЦИЯ ==========
const initDarkMode = () => {
  const storedAppDarkMode = localStorage.getItem('appDarkMode')
  const storedLegacyDarkMode = localStorage.getItem('darkMode')
  const savedDarkMode = storedAppDarkMode === 'true' ? true : (storedAppDarkMode === 'false' ? false : storedLegacyDarkMode === 'true')

  if (savedDarkMode) {
    document.documentElement.classList.add('dark-theme')
    document.body.classList.add('dark-theme')
  }
}

// ========== ПАРАМЕТРЛЕРДІ ИНИЦИАЛИЗАЦИЯ ==========
const initSettings = () => {
  const storedAppDarkMode = localStorage.getItem('appDarkMode')
  const storedLegacyDarkMode = localStorage.getItem('darkMode')
  const savedDarkMode = storedAppDarkMode === 'true' ? true : (storedAppDarkMode === 'false' ? false : storedLegacyDarkMode === 'true')

  if (settingsStore.darkMode !== savedDarkMode) {
    settingsStore.darkMode = savedDarkMode
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const initializeApp = () => {
  initLanguage()
  initDarkMode()
  initSettings()
  settingsStore.initSettings()
  notificationsStore.initNotifications()
}

onMounted(() => {
  initializeApp()
})
</script>

<style>
/* ========== БАРЛЫҚ СТИЛЬДЕР ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: #f0f2f5;
  transition: background-color 0.3s ease;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.main-content {
  flex: 1;
  margin-left: 296px;
  padding: 24px 32px;
}

.auth-layout {
  width: 100%;
  min-height: 100vh;
}

/* ========== ТҰРАҚТЫ ФЛОАТТЫ БАТЫРМА ========== */
.resources-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
}

.float-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 50px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  transition: all 0.3s ease;
  color: white;
  font-weight: 600;
}

.float-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgba(99, 102, 241, 0.45);
}

.float-icon {
  font-size: 22px;
}

.float-text {
  font-size: 14px;
}

/* ========== МОДАЛЬДЫ ТЕРЕЗЕ ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 32px;
  width: 380px;
  max-width: 90%;
  max-height: 85vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  box-shadow: 0 32px 64px -24px rgba(0, 0, 0, 0.25);
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eef2f6;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #6366f1;
}

.modal-title span:first-child {
  font-size: 24px;
}

.modal-close {
  background: rgba(99, 102, 241, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  color: #6366f1;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: scale(1.05);
}

.modal-body {
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f2f5;
  color: #1e293b;
  cursor: pointer;
}

.modal-item:hover {
  background: #f8fafc;
}

.modal-item-icon {
  font-size: 28px;
}

.modal-item-info {
  flex: 1;
}

.modal-item-info strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 4px;
}

.modal-item-info small {
  font-size: 11px;
  color: #64748b;
}

.modal-item-arrow {
  font-size: 18px;
  color: #cbd5e1;
  transition: all 0.2s;
}

.modal-item:hover .modal-item-arrow {
  color: #6366f1;
  transform: translateX(4px);
}

.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: center;
}

.footer-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 28px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s;
}

.footer-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

/* ========== ҚАРАҢҒЫ РЕЖИМ ========== */
:root.dark-theme .modal-content {
  background: #1e293b;
}

:root.dark-theme .modal-header {
  background: #334155;
  border-bottom-color: #475569;
}

:root.dark-theme .modal-title {
  color: #a78bfa;
}

:root.dark-theme .modal-item {
  border-bottom-color: #334155;
  color: #cbd5e1;
}

:root.dark-theme .modal-item:hover {
  background: #334155;
}

:root.dark-theme .modal-item-info strong {
  color: #f1f5f9;
}

:root.dark-theme .modal-item-info small {
  color: #94a3b8;
}

:root.dark-theme .modal-footer {
  border-top-color: #334155;
}

:root.dark-theme .footer-btn {
  background: #334155;
  color: #cbd5e1;
}

:root.dark-theme .footer-btn:hover {
  background: #475569;
  color: #a78bfa;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 106px;
    padding: 16px;
  }
}

@media (max-width: 900px) {
  .resources-float {
    bottom: 20px;
    right: 20px;
  }
  
  .float-btn {
    padding: 12px 20px;
  }
  
  .float-text {
    font-size: 13px;
  }
}

@media (max-width: 500px) {
  .float-text {
    display: none;
  }
  
  .float-btn {
    padding: 14px;
    border-radius: 50px;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

::selection {
  background: #6366f1;
  color: white;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f0f2f5;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #eef2f6;
  --sidebar-bg: #ffffff;
  --input-bg: #ffffff;
  --card-bg: #ffffff;
}

:root.dark-theme {
  --bg-primary: #1a1a2e;
  --bg-secondary: #0f0f1e;
  --text-primary: #e8e8f0;
  --text-secondary: #a8a8b8;
  --border-color: #2a2a3e;
  --sidebar-bg: #2a2a3e;
  --input-bg: #3a3a4e;
  --card-bg: #252535;
}

body.dark-theme {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

body.dark-theme #app {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

body.dark-theme .app-layout {
  background: var(--bg-secondary);
}

body.dark-theme .main-content {
  background: var(--bg-secondary);
}
</style>