<template>
  <div class="history-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <History :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1>История</h1>
          <p>История всех ваших переводов</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <BarChart3 :size="16" />
          <span>{{ history.length }} переводов</span>
        </div>
        <button 
          v-if="history.length > 0" 
          class="clear-all-btn"
          @click="clearAllHistory"
        >
          <Trash2 :size="14" />
          <span>Очистить все</span>
        </button>
      </div>
    </div>

    <!-- Статистика карточкалары -->
    <div class="stats-row" v-if="history.length > 0">
      <div class="stat-mini-card">
        <div class="stat-mini-icon purple">
          <FileText :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ history.length }}</div>
          <div class="stat-mini-label">Всего переводов</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon blue">
          <Calendar :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ getTodayCount }}</div>
          <div class="stat-mini-label">Сегодня</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon green">
          <Flame :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ getWeekCount }}</div>
          <div class="stat-mini-label">За неделю</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon orange">
          <Star :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ getMostUsedWord }}</div>
          <div class="stat-mini-label">Частое слово</div>
        </div>
      </div>
    </div>

    <!-- История тізімі -->
    <div class="history-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <List :size="20" />
            <h3>История переводов</h3>
          </div>
          <div class="header-filters" v-if="history.length > 0">
            <button 
              class="filter-chip" 
              :class="{ active: filterType === 'all' }"
              @click="filterType = 'all'"
            >
              Все
            </button>
            <button 
              class="filter-chip" 
              :class="{ active: filterType === 'today' }"
              @click="filterType = 'today'"
            >
              Сегодня
            </button>
            <button 
              class="filter-chip" 
              :class="{ active: filterType === 'week' }"
              @click="filterType = 'week'"
            >
              Неделя
            </button>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="filteredHistory.length === 0" class="empty-state">
          <div class="empty-icon">
            <Inbox :size="64" :stroke-width="1" />
          </div>
          <p>История переводов пуста</p>
          <small>Сделайте первый перевод на главной странице</small>
          <router-link to="/" class="empty-btn">
            <Plus :size="16" />
            <span>Перейти к переводу</span>
          </router-link>
        </div>

        <!-- История тізімі -->
        <div v-else class="history-list">
          <div 
            v-for="(item, index) in filteredHistory" 
            :key="index"
            class="history-item"
          >
            <div class="history-item-header">
              <div class="history-text">
                <MessageSquare :size="16" />
                <span>{{ item.text }}</span>
              </div>
              <button class="delete-btn" @click="deleteItem(index)">
                <XCircle :size="18" />
              </button>
            </div>
            <div class="history-translation">
              <div class="translation-icon">
                <Languages :size="20" />
              </div>
              <span>{{ item.translation }}</span>
            </div>
            <div class="history-footer">
              <div class="history-date">
                <CalendarDays :size="12" />
                <span>{{ item.date }}</span>
              </div>
              <div class="history-actions">
                <button class="history-action" @click="repeatTranslation(item.text)">
                  <Repeat :size="14" />
                  <span>Повторить</span>
                </button>
                <button class="history-action" @click="copyText(item.text)">
                  <Copy :size="14" />
                  <span>Копировать</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Подвал -->
        <div v-if="history.length > 0" class="card-footer">
          <div class="footer-info">
            <Database :size="14" />
            <span>Всего: {{ history.length }} переводов</span>
          </div>
          <button class="export-btn" @click="exportHistory">
            <Download :size="14" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import apiClient from '../api'
import { useAuthStore } from '../stores/auth'

// Lucide иконкаларын импорттау
import { 
  History as HistoryIcon, BarChart3, Trash2, FileText, Calendar,
  Flame, Star, List, Inbox, Plus, MessageSquare, XCircle,
  Languages, CalendarDays, Repeat, Copy, Database, Download
} from 'lucide-vue-next'

const router = useRouter()

// Деректер
const history = ref([])
const filterType = ref('all')

// Статистика
const getTodayCount = computed(() => {
  const today = new Date().toLocaleDateString()
  return history.value.filter(item => item.date.includes(today)).length
})

const getWeekCount = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return history.value.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate >= weekAgo
  }).length
})

const getMostUsedWord = computed(() => {
  const words = history.value.map(item => item.text.split(' ')).flat()
  const wordCount = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })
  const mostUsed = Object.entries(wordCount).sort((a, b) => b[1] - a[1])[0]
  return mostUsed ? mostUsed[0].slice(0, 15) : '-'
})

// Фильтрленген тізім
const filteredHistory = computed(() => {
  if (filterType.value === 'today') {
    const today = new Date().toLocaleDateString()
    return history.value.filter(item => item.date.includes(today))
  }
  if (filterType.value === 'week') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return history.value.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= weekAgo
    })
  }
  return history.value
})

// Тарихты жүктеу
const loadHistory = async () => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    try {
      const response = await apiClient.get('/api/history')
      history.value = response.data.map(item => ({
        id: item.id,
        text: item.text,
        translation: item.translation,
        date: new Date(item.created_at).toLocaleString()
      }))
    } catch (error) {
      console.error('Error loading history:', error)
      loadFromLocalStorage()
    }
  } else {
    loadFromLocalStorage()
  }
}

// Загрузка из localStorage
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('translationHistory')
  if (saved) {
    history.value = JSON.parse(saved).map(item => ({
      text: item.text,
      translation: item.translation,
      date: item.date
    }))
  } else {
    history.value = []
  }
}

// Барлығын өшіру
const clearAllHistory = async () => {
  if (confirm('Вы уверены, что хотите удалить всю историю переводов?')) {
    const authStore = useAuthStore()
    if (authStore.isLoggedIn) {
      try {
        for (const item of history.value) {
          await apiClient.delete(`/api/history/${item.id}`)
        }
        history.value = []
      } catch (error) {
        console.error('Error clearing history:', error)
        alert('Ошибка при удалении истории')
      }
    } else {
      history.value = []
      localStorage.setItem('translationHistory', JSON.stringify([]))
    }
  }
}

// Бір элементті өшіру
const deleteItem = async (index) => {
  const item = filteredHistory.value[index]
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    try {
      await apiClient.delete(`/api/history/${item.id}`)
      const realIndex = history.value.findIndex(h => h.id === item.id)
      if (realIndex !== -1) {
        history.value.splice(realIndex, 1)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Ошибка при удалении элемента')
    }
  } else {
    const realIndex = history.value.findIndex(h => h.text === item.text && h.translation === item.translation)
    if (realIndex !== -1) {
      history.value.splice(realIndex, 1)
      localStorage.setItem('translationHistory', JSON.stringify(history.value))
    }
  }
}

// Қайталау
const repeatTranslation = (text) => {
  localStorage.setItem('repeatText', text)
  router.push('/')
}

// Көшіру
const copyText = (text) => {
  navigator.clipboard.writeText(text)
  alert('Текст скопирован!')
}

// Экспорт
const exportHistory = () => {
  const data = JSON.stringify(history.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `history_${new Date().toISOString().slice(0, 19)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
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

.clear-all-btn {
  background: #fee2e2;
  border: none;
  border-radius: 40px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #fecaca;
  transform: translateY(-2px);
}

/* ========== СТАТИСТИКА КАРТОЧКАЛАРЫ ========== */
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

/* ========== ТАРИХ КАРТОЧКАСЫ ========== */
.history-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.history-card:hover {
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
  margin-bottom: 24px;
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

.header-filters {
  display: flex;
  gap: 8px;
}

.filter-chip {
  background: #f1f5f9;
  border: none;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: #e2e8f0;
}

.filter-chip.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
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
  display: block;
  margin-bottom: 24px;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

/* ========== ИСТОРИЯ ТІЗІМІ ========== */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  background: #f8fafc;
  border-radius: 24px;
  padding: 20px;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
}

.history-item:hover {
  background: white;
  border-color: #e2e8f0;
  transform: translateX(4px);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.history-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.2s;
  padding: 4px;
  border-radius: 8px;
  color: #64748b;
}

.delete-btn:hover {
  opacity: 1;
  color: #ef4444;
  background: #fee2e2;
}

.history-translation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 10px 12px;
  background: white;
  border-radius: 16px;
  font-size: 13px;
  color: #64748b;
}

.translation-icon {
  color: #6366f1;
}

.history-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-action {
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.history-action:hover {
  background: #eef2ff;
  color: #6366f1;
}

/* ========== ПОДВАЛ ========== */
.card-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
}

.export-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 20px;
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

.export-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .history-footer {
    flex-direction: column;
    align-items: flex-start;
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
  
  .history-item-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .delete-btn {
    align-self: flex-end;
  }
}
</style>