<template>
  <div class="profile-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <User :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 data-i18n="profile_title">Профиль</h1>
          <p data-i18n="profile_subtitle">Жеке ақпаратыңыз және параметрлеріңіз</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <BarChart3 :size="16" />
          <span>{{ translationCount }} <span data-i18n="stat_translations">аударма</span></span>
        </div>
        <button class="edit-profile-btn" @click="editMode = !editMode">
          <Pen :size="14" />
          <span>{{ editMode ? 'Сақтау' : 'Өңдеу' }}</span>
        </button>
      </div>
    </div>

    <!-- Статистика карточкалары -->
    <div class="stats-row">
      <div class="stat-mini-card">
        <div class="stat-mini-icon purple">
          <FileText :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ translationCount }}</div>
          <div class="stat-mini-label" data-i18n="stat_translations">Аудармалар</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon blue">
          <Mic :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ voiceCount }}</div>
          <div class="stat-mini-label" data-i18n="stat_voice">Дауыстық сұрау</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon green">
          <Star :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ favoriteWordsCount }}</div>
          <div class="stat-mini-label" data-i18n="stat_frequent">Жиі сөздер</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon orange">
          <Flame :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ streakDays }}</div>
          <div class="stat-mini-label" data-i18n="stat_streak">Күндік серия</div>
        </div>
      </div>
    </div>

    <!-- Профиль карточкасы -->
    <div class="profile-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="profile-flex">
          <div class="avatar-section">
            <div class="avatar-large">
              <User :size="40" class="avatar-emoji" />
              <div class="avatar-initials">{{ userInitials }}</div>
            </div>
            <button class="avatar-edit" @click="changeAvatar">
              <Camera :size="14" />
            </button>
          </div>
          <div class="profile-details">
            <div class="profile-name">
              <h2 v-if="!editMode">{{ userName }}</h2>
              <input v-else v-model="editedName" class="edit-input name-input" />
            </div>
            <div class="profile-email">
              <Mail :size="14" />
              <span v-if="!editMode">{{ userEmail }}</span>
              <input v-else v-model="editedEmail" class="edit-input email-input" />
            </div>
            <div class="profile-badges">
              <span class="profile-badge">
                <Crown :size="12" />
                <span data-i18n="admin_role">{{ userRole }}</span>
              </span>
              <span class="profile-badge">
                <Calendar :size="12" />
                <span data-i18n="registered_date">Тіркелген: {{ registeredDate }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Жеке ақпарат карточкасы -->
    <div class="info-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <ClipboardList :size="20" />
            <h3 data-i18n="personal_info">Жеке ақпарат</h3>
          </div>
        </div>

        <div class="info-list">
          <div class="info-item">
            <div class="info-label">
              <User :size="14" />
              <span data-i18n="full_name">Аты-жөні</span>
            </div>
            <div class="info-value" v-if="!editMode">{{ userName }}</div>
            <input v-else v-model="editedName" class="info-edit-input" />
          </div>

          <div class="info-item">
            <div class="info-label">
              <Mail :size="14" />
              <span data-i18n="email">Email</span>
            </div>
            <div class="info-value" v-if="!editMode">{{ userEmail }}</div>
            <input v-else v-model="editedEmail" class="info-edit-input" type="email" />
          </div>

          <div class="info-item">
            <div class="info-label">
              <Crown :size="14" />
              <span data-i18n="role">Рөл</span>
            </div>
            <div class="info-value">
              <span class="role-badge">{{ userRole }}</span>
            </div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <Clock :size="14" />
              <span data-i18n="last_login">Соңғы кіру</span>
            </div>
            <div class="info-value">{{ lastLogin }}</div>
          </div>
        </div>

        <div class="card-actions" v-if="editMode">
          <button class="save-btn" @click="saveProfile">
            <Check :size="14" />
            <span data-i18n="save">Сақтау</span>
          </button>
          <button class="cancel-btn" @click="cancelEdit">
            <X :size="14" />
            <span data-i18n="cancel">Болдырмау</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Параметрлер карточкасы -->
    <div class="settings-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <Settings :size="20" />
            <h3 data-i18n="settings">Параметрлер</h3>
          </div>
        </div>

        <div class="settings-list">
          <!-- Хабарландырулар -->
          <div class="setting-item">
            <div class="setting-info">
              <Bell :size="20" />
              <div>
                <div class="setting-title" data-i18n="notifications">Хабарландырулар</div>
                <div class="setting-desc" data-i18n="notifications_desc">Жаңа функциялар туралы хабарландырулар алу</div>
              </div>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="notifications" @change="saveNotifications">
              <span class="slider"></span>
            </label>
          </div>

          <!-- Қараңғы режим -->
          <div class="setting-item">
            <div class="setting-info">
              <Moon :size="20" />
              <div>
                <div class="setting-title" data-i18n="dark_mode">Қараңғы режим</div>
                <div class="setting-desc" data-i18n="dark_mode_desc">Интерфейстің түс схемасын өзгерту</div>
              </div>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="darkMode" @change="toggleDarkMode">
              <span class="slider"></span>
            </label>
          </div>

          <!-- Тіл -->
          <div class="setting-item">
            <div class="setting-info">
              <Globe :size="20" />
              <div>
                <div class="setting-title" data-i18n="language">Тіл</div>
                <div class="setting-desc" data-i18n="language_desc">Интерфейс тілін өзгерту</div>
              </div>
            </div>
            <div class="language-buttons">
              <button 
                class="lang-btn" 
                :class="{ active: currentLang === 'kk' }"
                @click="changeLanguage('kk')"
              >
                🇰🇿 Қаз
              </button>
              <button 
                class="lang-btn" 
                :class="{ active: currentLang === 'ru' }"
                @click="changeLanguage('ru')"
              >
                🇷🇺 Рус
              </button>
              <button 
                class="lang-btn" 
                :class="{ active: currentLang === 'en' }"
                @click="changeLanguage('en')"
              >
                🇬🇧 Eng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Қауіпсіздік карточкасы -->
    <div class="security-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <Shield :size="20" />
            <h3 data-i18n="security">Қауіпсіздік</h3>
          </div>
        </div>

        <div class="security-buttons">
          <button class="security-btn" @click="changePassword">
            <KeyRound :size="14" />
            <span data-i18n="change_password">Құпия сөзді өзгерту</span>
          </button>
          <button class="security-btn logout" @click="handleLogout">
            <LogOut :size="14" />
            <span data-i18n="logout">Шығу</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { setLanguage, currentLanguage, loadLanguage, translatePage, t } from '../i18n'

// Lucide иконкалары
import { 
  User, BarChart3, Pen, FileText, Mic, Star, Flame,
  Camera, Mail, Crown, Calendar, ClipboardList, Clock,
  Check, X, Settings, Bell, Moon, Globe, Shield, KeyRound, LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Пайдаланушы деректері
const userName = computed(() => authStore.user?.name || t('user'))
const userEmail = computed(() => authStore.user?.email || 'user@example.com')
const userRole = computed(() => authStore.user?.role === 'admin' ? t('admin_role') : t('user_role'))
const userInitials = computed(() => userName.value.charAt(0).toUpperCase())

// Редакциялау режимі
const editMode = ref(false)
const editedName = ref('')
const editedEmail = ref('')

// Статистика
const translationCount = ref(0)
const voiceCount = ref(0)
const favoriteWordsCount = ref(0)
const streakDays = ref(7)

// Параметрлер
const notifications = ref(true)
const darkMode = ref(false)
const currentLang = ref('kk')

// Басқа деректер
const registeredDate = ref('2024-01-15')
const lastLogin = ref(new Date().toLocaleString())

// Хабарландыруларды сақтау
const saveNotifications = () => {
  localStorage.setItem('notifications', notifications.value)
}

// ========== ТІЛДІ ӨЗГЕРТУ (БЕТТІ ҚАЙТА ЖҮКТЕМЕЙ) ==========
const changeLanguage = (lang) => {
  currentLang.value = lang
  setLanguage(lang)
  console.log('Тіл өзгертілді:', lang)
}

// ========== ҚАРАҢҒЫ РЕЖИМ ==========
const toggleDarkMode = () => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark-theme')
    document.body.classList.add('dark-theme')
    localStorage.setItem('appDarkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark-theme')
    document.body.classList.remove('dark-theme')
    localStorage.setItem('appDarkMode', 'false')
  }
}

const loadDarkMode = () => {
  const storedAppDarkMode = localStorage.getItem('appDarkMode')
  const storedLegacyDarkMode = localStorage.getItem('darkMode')
  const savedDarkMode = storedAppDarkMode === 'true' ? true : (storedAppDarkMode === 'false' ? false : storedLegacyDarkMode === 'true')
  darkMode.value = savedDarkMode

  if (savedDarkMode) {
    document.documentElement.classList.add('dark-theme')
    document.body.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
    document.body.classList.remove('dark-theme')
  }
}

// ========== СТАТИСТИКА ==========
const loadStats = () => {
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  translationCount.value = history.length
  
  const voiceHistory = JSON.parse(localStorage.getItem('voiceHistory') || '[]')
  voiceCount.value = voiceHistory.length
  
  const words = JSON.parse(localStorage.getItem('signDictionary') || '[]')
  favoriteWordsCount.value = words.length
  
  if (history.length > 0) {
    const dates = [...new Set(history.map(item => item.date.split(',')[0]))]
    dates.sort((a, b) => new Date(b) - new Date(a))
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    for (let i = 0; i < dates.length; i++) {
      const itemDate = new Date(dates[i])
      itemDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate - itemDate) / (1000 * 60 * 60 * 24))
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }
    streakDays.value = streak
  }
}

// ========== ПРОФИЛЬ ФУНКЦИЯЛАРЫ ==========
const saveProfile = async () => {
  if (!editedName.value.trim() || !editedEmail.value.trim()) {
    alert(t('fill_required_fields') || 'Аты-жөніңіз бен email енгізіңіз')
    return
  }

  const result = await authStore.updateProfile(
    editedName.value.trim(),
    editedEmail.value.trim()
  )

  if (result.success) {
    alert(t('profile_saved'))
    editMode.value = false
  } else {
    alert(result.message)
  }
}

const cancelEdit = () => {
  editedName.value = userName.value
  editedEmail.value = userEmail.value
  editMode.value = false
}

const changeAvatar = () => {
  alert(t('avatar_change_msg'))
}

const changePassword = () => {
  const newPassword = prompt(t('enter_new_password'))
  if (newPassword && newPassword.length >= 6) {
    alert(t('password_changed'))
  } else if (newPassword) {
    alert(t('password_too_short'))
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// ========== ПАРАМЕТРЛЕРДІ ЖҮКТЕУ ==========
const loadSettings = () => {
  const savedNotifications = localStorage.getItem('notifications')
  if (savedNotifications !== null) {
    notifications.value = savedNotifications === 'true'
  }
  loadDarkMode()
  loadLanguage()
  currentLang.value = currentLanguage.value || 'kk'
}

onMounted(async () => {
  authStore.initAuth()
  loadStats()
  loadSettings()
  editedName.value = userName.value
  editedEmail.value = userEmail.value
  translatePage()
  
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
})
</script>

<style scoped>
.profile-container {
  width: 100%;
}

/* ========== БЕТ БАСЫ ========== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.header-content p {
  font-size: 14px;
  color: #64748b;
}

.header-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-badge {
  background: white;
  border-radius: 40px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  border: 1px solid #eef2f6;
}

.edit-profile-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 40px;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

/* ========== СТАТИСТИКА ========== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-mini-card {
  background: white;
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #eef2f6;
  transition: all 0.2s;
}

.stat-mini-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.1);
}

.stat-mini-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: white;
}

.stat-mini-icon.purple { background: #8b5cf6; }
.stat-mini-icon.blue { background: #3b82f6; }
.stat-mini-icon.green { background: #10b981; }
.stat-mini-icon.orange { background: #f59e0b; }

.stat-mini-info {
  flex: 1;
}

.stat-mini-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.stat-mini-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* ========== КАРТОЧКАЛАР ========== */
.profile-card, .info-card, .settings-card, .security-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.profile-card:hover, .info-card:hover, .settings-card:hover, .security-card:hover {
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
}

.card-content {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
}

.card-header h3 {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* ========== ПРОФИЛЬ КАРТОЧКАСЫ ========== */
.profile-flex {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.avatar-section {
  position: relative;
}

.avatar-large {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-emoji {
  position: absolute;
  opacity: 0.3;
  color: white;
}

.avatar-initials {
  font-size: 40px;
  font-weight: 700;
  color: white;
  z-index: 1;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  color: #475569;
}

.avatar-edit:hover {
  transform: scale(1.05);
  color: #6366f1;
}

.profile-details {
  flex: 1;
}

.profile-name h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.profile-email {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.profile-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

.edit-input {
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
  width: 100%;
  max-width: 280px;
}

.name-input {
  font-size: 20px;
  font-weight: 700;
}

/* ========== ЖЕКЕ АҚПАРАТ ========== */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f2f5;
  gap: 16px;
  flex-wrap: wrap;
}

.info-label {
  width: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.info-value {
  font-size: 14px;
  color: #1e293b;
  flex: 1;
}

.info-edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
}

.role-badge {
  background: #eef2ff;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
  color: #6366f1;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.save-btn, .cancel-btn {
  padding: 8px 20px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn {
  background: #f1f5f9;
  border: none;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

/* ========== ПАРАМЕТРЛЕР ========== */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.setting-desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* ========== ТІЛ ТАҢДАУ ========== */
.language-buttons {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 40px;
}

.lang-btn {
  padding: 6px 16px;
  border-radius: 32px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.lang-btn:hover {
  background: #e2e8f0;
}

.lang-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

/* ========== ҚАУІПСІЗДІК ========== */
.security-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.security-btn {
  background: #f1f5f9;
  border: none;
  padding: 10px 24px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.security-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.security-btn.logout {
  background: #fee2e2;
  color: #ef4444;
}

.security-btn.logout:hover {
  background: #fecaca;
}

/* ========== ҚАРАҢҒЫ РЕЖИМ ========== */
:root.dark-theme .profile-container {
  background: #0f172a;
}

:root.dark-theme .stat-badge,
:root.dark-theme .stat-mini-card,
:root.dark-theme .profile-card,
:root.dark-theme .info-card,
:root.dark-theme .settings-card,
:root.dark-theme .security-card {
  background: #1e293b;
  border-color: #334155;
}

:root.dark-theme .header-content h1,
:root.dark-theme .stat-mini-value,
:root.dark-theme .profile-name h2,
:root.dark-theme .setting-title,
:root.dark-theme .card-header h3,
:root.dark-theme .info-value {
  color: #f1f5f9;
}

:root.dark-theme .header-content p,
:root.dark-theme .stat-mini-label,
:root.dark-theme .profile-email,
:root.dark-theme .setting-desc,
:root.dark-theme .info-label {
  color: #94a3b8;
}

:root.dark-theme .language-buttons {
  background: #334155;
}

:root.dark-theme .lang-btn {
  color: #cbd5e1;
}

:root.dark-theme .lang-btn:hover {
  background: #475569;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-email {
    justify-content: center;
  }
  
  .profile-badges {
    justify-content: center;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    width: auto;
  }
}

@media (max-width: 500px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .card-content {
    padding: 18px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .security-buttons {
    flex-direction: column;
  }
  
  .security-btn {
    justify-content: center;
  }
}
</style>