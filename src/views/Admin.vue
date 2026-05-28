<template>
  <div class="admin-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <Shield :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 data-i18n="admin_title">Админ панелі</h1>
          <p data-i18n="admin_subtitle">Сөздікті басқару және статистика</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <Users :size="16" />
          <span>{{ users.length }} <span data-i18n="registered_users">пайдаланушы</span></span>
        </div>
        <div class="stat-badge">
          <BookOpen :size="16" />
          <span>{{ words.length }} <span data-i18n="dictionary_words">сөз</span></span>
        </div>
      </div>
    </div>

    <!-- Статистика карточкалары -->
    <div class="stats-row">
      <div class="stat-mini-card">
        <div class="stat-mini-icon purple">
          <BookOpen :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ words.length }}</div>
          <div class="stat-mini-label" data-i18n="dictionary_words_stat">Сөздіктегі сөздер</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon blue">
          <Users :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ users.length }}</div>
          <div class="stat-mini-label" data-i18n="registered_users_stat">Тіркелген пайдаланушы</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon green">
          <Activity :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ todayTranslations }}</div>
          <div class="stat-mini-label" data-i18n="today_translations_stat">Бүгінгі аударма</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon orange">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ totalTranslations }}</div>
          <div class="stat-mini-label" data-i18n="total_translations_stat">Барлық аударма</div>
        </div>
      </div>
    </div>

    <!-- Табтар (Tabs) -->
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'words' }"
        @click="activeTab = 'words'"
      >
        <BookOpen :size="16" />
        <span data-i18n="dictionary_tab">Сөздік</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        <Users :size="16" />
        <span data-i18n="users_tab">Пайдаланушылар</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'stats' }"
        @click="activeTab = 'stats'"
      >
        <BarChart3 :size="16" />
        <span data-i18n="statistics_tab">Статистика</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'settings' }"
        @click="activeTab = 'settings'"
      >
        <Settings :size="16" />
        <span data-i18n="settings_tab">Параметрлер</span>
      </button>
    </div>

    <!-- ========== СӨЗДІК ТАБЫ ========== -->
    <div v-if="activeTab === 'words'" class="words-section">
      <!-- Жаңа сөз қосу -->
      <div class="add-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <PlusCircle :size="20" />
              <h3 data-i18n="add_word">Жаңа сөз қосу</h3>
            </div>
          </div>
          
          <div class="add-form">
            <div class="form-row">
              <div class="form-group">
                <label data-i18n="word_placeholder">Сөз (қазақша)</label>
                <div class="input-icon">
                  <FileText :size="16" class="icon" />
                  <input 
                    v-model="newWord.text" 
                    type="text" 
                    :placeholder="t('word_placeholder') + ' - Кешіріңіз'"
                    @keyup.enter="addWord"
                  />
                </div>
              </div>
              <div class="form-group">
                <label data-i18n="video_url_placeholder">Видео URL</label>
                <div class="input-icon">
                  <Video :size="16" class="icon" />
                  <input 
                    v-model="newWord.video_url" 
                    type="text" 
                    placeholder="https://example.com/video.mp4"
                    @keyup.enter="addWord"
                  />
                </div>
              </div>
              <div class="form-group">
                <label data-i18n="category_placeholder">Категория</label>
                <div class="input-icon">
                  <Tag :size="16" class="icon" />
                  <select v-model="newWord.category">
                    <option value="">-- Таңдаңыз --</option>
                    <option value="сөз">Сөз</option>
                    <option value="сөйлем">Сөйлем</option>
                    <option value="етістік">Етістік</option>
                    <option value="зат">Зат</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group full-width">
                <label data-i18n="example_placeholder">Мысал сөйлем (қосымша)</label>
                <div class="input-icon">
                  <MessageSquare :size="16" class="icon" />
                  <input 
                    v-model="newWord.example" 
                    type="text" 
                    :placeholder="t('example_placeholder') + ' - Кешіріңіз, мен кешіктім'"
                    @keyup.enter="addWord"
                  />
                </div>
              </div>
            </div>
            <button class="add-btn" @click="addWord">
              <Plus :size="16" />
              <span data-i18n="add_word">Сөзді қосу</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Сөздер тізімі -->
      <div class="words-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <List :size="20" />
              <h3 data-i18n="word_list">Сөздік тізімі ({{ words.length }})</h3>
            </div>
            <div class="header-actions">
              <div class="search-box">
                <Search :size="16" />
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  :placeholder="t('search_word')"
                />
              </div>
              <button class="export-btn" @click="exportWords">
                <Download :size="14" />
                <span data-i18n="export">Экспорт</span>
              </button>
            </div>
          </div>

          <div class="words-grid">
            <div 
              v-for="(word, index) in filteredWords" 
              :key="index"
              class="word-item"
            >
              <div class="word-info">
                <div class="word-text">{{ word.text }}</div>
                <div class="word-details">
                  <span class="word-video">
                    <Video :size="12" />
                    {{ word.video_url || word.video }}
                  </span>
                  <span v-if="word.category" class="word-category">
                    <Tag :size="12" />
                    {{ word.category }}
                  </span>
                  <span v-if="word.example" class="word-example">
                    <MessageSquare :size="12" />
                    {{ word.example }}
                  </span>
                </div>
              </div>
              <div class="word-actions">
                <button class="edit-word" @click="editWord(index)" :title="t('edit_word')">
                  <Pen :size="14" />
                </button>
                <button class="delete-word" @click="deleteWord(index)" :title="t('delete_word')">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredWords.length === 0" class="empty-state">
            <div class="empty-icon">
              <Inbox :size="64" :stroke-width="1" />
            </div>
            <p data-i18n="no_words">Сөздер жоқ</p>
            <small data-i18n="add_word_hint">Жоғарыдағы форма арқылы жаңа сөз қосыңыз</small>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== ПАЙДАЛАНУШЫЛАР ТАБЫ ========== -->
    <div v-if="activeTab === 'users'" class="users-section">
      <div class="users-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <Users :size="20" />
              <h3 data-i18n="user_list_title">Пайдаланушылар тізімі</h3>
            </div>
            <div class="search-box">
              <Search :size="16" />
              <input 
                v-model="userSearchQuery" 
                type="text" 
                :placeholder="t('search_user')"
              />
            </div>
          </div>

          <div class="users-list">
            <div 
              v-for="(user, index) in filteredUsers" 
              :key="index"
              class="user-item"
            >
              <div class="user-avatar">
                <div class="avatar-initials">{{ user.name.charAt(0).toUpperCase() }}</div>
              </div>
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-meta">
                  <span class="user-role" :class="user.role === 'admin' ? 'admin' : 'user'">
                    <Crown v-if="user.role === 'admin'" :size="12" />
                    <User v-else :size="12" />
                    <span v-if="user.role === 'admin'" data-i18n="admin_role">Админ</span>
                    <span v-else data-i18n="user_role">Қолданушы</span>
                  </span>
                  <span class="user-date">
                    <Calendar :size="12" />
                    {{ user.registeredAt || '2024-01-15' }}
                  </span>
                </div>
              </div>
              <div class="user-actions" v-if="user.role !== 'admin'">
                <button class="delete-user" @click="deleteUser(index)" :title="t('delete_user')">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredUsers.length === 0" class="empty-state">
            <div class="empty-icon">
              <Users :size="64" :stroke-width="1" />
            </div>
            <p data-i18n="no_users">Пайдаланушылар жоқ</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== СТАТИСТИКА ТАБЫ ========== -->
    <div v-if="activeTab === 'stats'" class="stats-section">
      <div class="stats-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <BarChart3 :size="20" />
              <h3 data-i18n="statistics">Аударма статистикасы</h3>
            </div>
          </div>

          <div class="stats-charts">
            <div class="chart-row">
              <div class="chart-label">
                <span data-i18n="total_translations_stat">Аудармалар саны</span>
                <span class="chart-value">{{ totalTranslations }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getProgressPercent(totalTranslations) + '%' }"></div>
              </div>
            </div>
            <div class="chart-row">
              <div class="chart-label">
                <span data-i18n="registered_users">Пайдаланушылар саны</span>
                <span class="chart-value">{{ users.length }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill blue" :style="{ width: getProgressPercent(users.length, 100) + '%' }"></div>
              </div>
            </div>
            <div class="chart-row">
              <div class="chart-label">
                <span data-i18n="dictionary_words_stat">Сөздік көлемі</span>
                <span class="chart-value">{{ words.length }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill green" :style="{ width: getProgressPercent(words.length, 500) + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="stats-info">
            <div class="info-item">
              <Calendar :size="16" />
              <span>Соңғы 7 күнде: {{ weeklyTranslations }} <span data-i18n="stat_translations">аударма</span></span>
            </div>
            <div class="info-item">
              <Award :size="16" />
              <span data-i18n="most_active_user">Ең белсенді пайдаланушы: {{ topUser }}</span>
            </div>
            <div class="info-item">
              <Star :size="16" />
              <span data-i18n="most_used_word">Ең көп қолданылған сөз: {{ topWord }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== ПАРАМЕТРЛЕР ТАБЫ ========== -->
    <div v-if="activeTab === 'settings'" class="settings-section">
      <div class="settings-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <Settings :size="20" />
              <h3 data-i18n="settings_tab">Параметрлер</h3>
            </div>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <Database :size="18" />
                <div>
                  <div class="setting-title" data-i18n="backup_data_title">Деректерді сақтау</div>
                  <div class="setting-desc" data-i18n="backup_data_desc">Барлық деректерді JSON файлына сақтау</div>
                </div>
              </div>
              <button class="setting-btn" @click="backupData">
                <Download :size="14" />
                <span data-i18n="backup_data">Архивтеу</span>
              </button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <Upload :size="18" />
                <div>
                  <div class="setting-title" data-i18n="restore_data_title">Деректерді жүктеу</div>
                  <div class="setting-desc" data-i18n="restore_data_desc">Архивтен деректерді қалпына келтіру</div>
                </div>
              </div>
              <button class="setting-btn" @click="restoreData">
                <Upload :size="14" />
                <span data-i18n="restore_data">Қалпына келтіру</span>
              </button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <Trash2 :size="18" />
                <div>
                  <div class="setting-title" data-i18n="clear_all_title">Барлық деректерді тазалау</div>
                  <div class="setting-desc" data-i18n="clear_all_desc">Сөздік пен тарихты толығымен өшіру</div>
                </div>
              </div>
              <button class="setting-btn danger" @click="clearAllData">
                <Trash2 :size="14" />
                <span data-i18n="clear_all">Тазалау</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { t, setLanguage, currentLanguage, loadLanguage, translatePage } from '../i18n'

// Lucide иконкалары
import { 
  Shield, Users, BookOpen, Activity, TrendingUp, BarChart3, Settings,
  PlusCircle, FileText, Video, MessageSquare, Plus, List, Search,
  Download, Pen, Trash2, Inbox, Crown, User, Calendar, Award, Star,
  Database, Upload, Tag
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Активті таб
const activeTab = ref('words')

// Сөздік деректері
const words = ref([])
const newWord = ref({ text: '', video_url: '', example: '', category: '' })
const searchQuery = ref('')

// Пайдаланушылар деректері
const users = ref([])
const userSearchQuery = ref('')

// Статистика
const totalTranslations = ref(0)
const todayTranslations = ref(0)
const weeklyTranslations = ref(0)
const topUser = ref('')
const topWord = ref('')

// Фильтрленген сөздер
const filteredWords = computed(() => {
  if (!searchQuery.value) return words.value
  return words.value.filter(w => 
    w.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Фильтрленген пайдаланушылар
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return users.value
  return users.value.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  )
})

// Прогресс пайызы
const getProgressPercent = (value, max = 200) => {
  return Math.min((value / max) * 100, 100)
}

// Сөз қосу
const addWord = () => {
  if (!newWord.value.text.trim()) {
    alert(t('error_fill_fields'))
    return
  }
  
  if (!newWord.value.video.trim()) {
    newWord.value.video = `${newWord.value.text}.mp4`
  }
  
  words.value.push({
    text: newWord.value.text,
    video_url: newWord.value.video_url || `${newWord.value.text}.mp4`,
    category: newWord.value.category,
    example: newWord.value.example || `${newWord.value.text} - мысал сөйлем`
  })
  
  localStorage.setItem('signDictionary', JSON.stringify(words.value))
  
  newWord.value = { text: '', video: '', example: '' }
  alert(t('added'))
}

// Сөз өшіру
const deleteWord = (index) => {
  if (confirm(t('confirm_delete'))) {
    words.value.splice(index, 1)
    localStorage.setItem('signDictionary', JSON.stringify(words.value))
  }
}

// Сөз өңдеу
const editWord = (index) => {
  const word = words.value[index]
  const newText = prompt(t('edit_word'), word.text)
  if (newText && newText.trim()) {
    word.text = newText.trim()
    localStorage.setItem('signDictionary', JSON.stringify(words.value))
  }
}

// Пайдаланушы өшіру
const deleteUser = (index) => {
  if (confirm(t('confirm_delete'))) {
    users.value.splice(index, 1)
    localStorage.setItem('registeredUsers', JSON.stringify(users.value))
  }
}

// Экспорт
const exportWords = () => {
  const data = JSON.stringify(words.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dictionary_${new Date().toISOString().slice(0, 19)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Архивтеу
const backupData = () => {
  const data = {
    words: words.value,
    users: users.value,
    date: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup_${new Date().toISOString().slice(0, 19)}.json`
  a.click()
  URL.revokeObjectURL(url)
  alert(t('saved'))
}

// Қалпына келтіру
const restoreData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.words) {
          words.value = data.words
          localStorage.setItem('signDictionary', JSON.stringify(words.value))
        }
        if (data.users) {
          users.value = data.users
          localStorage.setItem('registeredUsers', JSON.stringify(users.value))
        }
        alert(t('saved'))
      } catch (error) {
        alert(t('error'))
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

// Барлық деректерді тазалау
const clearAllData = () => {
  if (confirm(t('confirm_clear_all'))) {
    words.value = []
    users.value = users.value.filter(u => u.role === 'admin')
    localStorage.setItem('signDictionary', JSON.stringify([]))
    localStorage.setItem('registeredUsers', JSON.stringify(users.value))
    localStorage.setItem('translationHistory', JSON.stringify([]))
    alert(t('deleted'))
  }
}

// Статистиканы жүктеу
const loadStats = () => {
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  totalTranslations.value = history.length
  
  const today = new Date().toLocaleDateString()
  todayTranslations.value = history.filter(item => item.date.includes(today)).length
  
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weeklyTranslations.value = history.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate >= weekAgo
  }).length
  
  topUser.value = 'Асель'
  
  const wordsList = history.map(item => item.text.split(' ')).flat()
  const wordCount = {}
  wordsList.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1 })
  const mostUsed = Object.entries(wordCount).sort((a, b) => b[1] - a[1])[0]
  topWord.value = mostUsed ? mostUsed[0] : '-'
}

// Деректерді жүктеу
const loadData = () => {
  const savedWords = localStorage.getItem('signDictionary')
  if (savedWords) words.value = JSON.parse(savedWords)
  
  const savedUsers = localStorage.getItem('registeredUsers')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  } else {
    users.value = [
      { name: 'Админ', email: 'admin@gmail.com', role: 'admin', registeredAt: '2024-01-01' },
      { name: 'Асель', email: 'asel@example.com', role: 'user', registeredAt: '2024-01-15' }
    ]
    localStorage.setItem('registeredUsers', JSON.stringify(users.value))
  }
}

// Админ емес пайдаланушыны басқа бетке жіберу
onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/')
  }
  loadData()
  loadStats()
  loadLanguage()
  translatePage()
  
  // Тіл өзгергенде бетті аудару
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
})
</script>

<style scoped>
.admin-container {
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

/* ========== ТАБТАР ========== */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  background: white;
  padding: 6px;
  border-radius: 60px;
  border: 1px solid #eef2f6;
  width: fit-content;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.tab-btn:hover {
  background: #f1f5f9;
}

.tab-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

/* ========== КАРТОЧКАЛАР ========== */
.add-card, .words-card, .users-card, .stats-card, .settings-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;
  transition: all 0.3s ease;
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
  flex-wrap: wrap;
  gap: 16px;
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

/* ========== ФОРМА ========== */
.add-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon .icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
}

.input-icon input,
.input-icon select {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
  background: white;
  appearance: none;
}

.input-icon select {
  -webkit-appearance: none;
  -moz-appearance: none;
}

.input-icon input:focus,
.input-icon select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  padding: 12px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

/* ========== ІЗДЕУ ========== */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 40px;
  padding: 6px 16px;
}

.search-box input {
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  width: 180px;
}

.export-btn {
  background: #f1f5f9;
  border: none;
  border-radius: 40px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.export-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

/* ========== СӨЗДЕР ТІЗІМІ ========== */
.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 20px;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
}

.word-item:hover {
  background: white;
  border-color: #e2e8f0;
}

.word-text {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.word-details {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.word-video, .word-example, .word-category {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.word-actions {
  display: flex;
  gap: 6px;
}

.edit-word, .delete-word {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
}

.edit-word:hover {
  background: #eef2ff;
  color: #6366f1;
}

.delete-word:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* ========== ПАЙДАЛАНУШЫЛАР ТІЗІМІ ========== */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 20px;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
}

.user-item:hover {
  background: white;
  border-color: #e2e8f0;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.user-email {
  font-size: 12px;
  color: #64748b;
}

.user-meta {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.user-role {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
}

.user-role.admin {
  background: #eef2ff;
  color: #6366f1;
}

.user-role.user {
  background: #f1f5f9;
  color: #475569;
}

.user-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.delete-user {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
}

.delete-user:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* ========== СТАТИСТИКА ========== */
.stats-charts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-row {
  width: 100%;
}

.chart-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #475569;
}

.chart-value {
  font-weight: 600;
  color: #1e293b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-fill.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.progress-fill.green { background: linear-gradient(90deg, #10b981, #34d399); }

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

/* ========== ПАРАМЕТРЛЕР ========== */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

.setting-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.setting-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

.setting-btn.danger:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* ========== ПУСТОЕ СОСТОЯНИЕ ========== */
.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state small {
  font-size: 13px;
  color: #94a3b8;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  .words-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    width: 100%;
    justify-content: center;
  }
  
  .tab-btn span {
    display: none;
  }
  
  .tab-btn {
    padding: 10px;
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
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box input {
    width: 120px;
  }
}

/* ========== DARK MODE STYLES ========== */
:root.dark-theme .admin-container {
  background: #0f172a;
}

:root.dark-theme .stat-badge,
:root.dark-theme .stat-mini-card,
:root.dark-theme .add-card,
:root.dark-theme .words-card,
:root.dark-theme .users-card,
:root.dark-theme .stats-card,
:root.dark-theme .settings-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}

:root.dark-theme .header-content h1,
:root.dark-theme .stat-mini-value,
:root.dark-theme .card-header h3,
:root.dark-theme .word-text,
:root.dark-theme .user-name,
:root.dark-theme .setting-title,
:root.dark-theme .chart-value {
  color: #f1f5f9 !important;
}

:root.dark-theme .header-content p,
:root.dark-theme .stat-mini-label,
:root.dark-theme .word-details,
:root.dark-theme .user-email,
:root.dark-theme .setting-desc,
:root.dark-theme .chart-label,
:root.dark-theme .info-item {
  color: #94a3b8 !important;
}

:root.dark-theme .input-icon input,
:root.dark-theme .search-box {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f1f5f9 !important;
}

:root.dark-theme .search-box input {
  background: #334155 !important;
}

:root.dark-theme .word-item,
:root.dark-theme .user-item,
:root.dark-theme .setting-item {
  background: #1e293b !important;
  border-color: #334155 !important;
}

:root.dark-theme .word-item:hover,
:root.dark-theme .user-item:hover {
  background: #334155 !important;
}

:root.dark-theme .tabs {
  background: #1e293b !important;
  border-color: #334155 !important;
}

:root.dark-theme .tab-btn {
  color: #94a3b8 !important;
}

:root.dark-theme .tab-btn:hover {
  background: #334155 !important;
}

:root.dark-theme .tab-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  color: white !important;
}

:root.dark-theme .setting-btn {
  background: #334155 !important;
  color: #cbd5e1 !important;
}

:root.dark-theme .setting-btn:hover {
  background: #475569 !important;
}
</style>