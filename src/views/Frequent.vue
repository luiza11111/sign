<template>
  <div class="frequent-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <Star :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1>Жиі сөздер</h1>
          <p>Ең көп қолданылатын сөздер тізімі</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <BarChart3 :size="16" />
          <span>{{ frequentWords.length }} сөз</span>
        </div>
        <button class="export-btn" @click="exportWords">
          <Download :size="14" />
          <span>Экспорт</span>
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
          <div class="stat-mini-value">{{ frequentWords.length }}</div>
          <div class="stat-mini-label">Барлық сөздер</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon blue">
          <Flame :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ totalUsage }}</div>
          <div class="stat-mini-label">Барлық қолдану</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon green">
          <Trophy :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ topWord }}</div>
          <div class="stat-mini-label">Ең көп қолданылған</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon orange">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ getTodayAdded }}</div>
          <div class="stat-mini-label">Бүгін қосылған</div>
        </div>
      </div>
    </div>

    <!-- Негізгі карточка -->
    <div class="frequent-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <Bookmark :size="20" />
            <h3>Жиі қолданылатын сөздер</h3>
          </div>
          <div class="header-actions">
            <button class="sort-btn" @click="sortWords">
              <ArrowUpDown :size="14" />
              <span>{{ sortOrder === 'usage' ? 'Қолдану бойынша' : 'Әліпби бойынша' }}</span>
            </button>
          </div>
        </div>

        <!-- Сөздер торы -->
        <div class="words-grid">
          <div 
            v-for="word in sortedWords" 
            :key="word.text"
            class="word-card"
            @click="copyWord(word.text)"
          >
            <div class="word-rank">#{{ getRank(word.text) }}</div>
            <div class="word-content">
              <div class="word-text">{{ word.text }}</div>
              <div class="word-example">
                <FileText :size="12" />
                <span>{{ word.example }}</span>
              </div>
              <div class="word-usage">
                <div class="usage-bar">
                  <div 
                    class="usage-fill" 
                    :style="{ width: getUsagePercent(word.usage) + '%' }"
                  ></div>
                </div>
                <div class="usage-stats">
                  <MousePointerClick :size="11" />
                  <span>{{ word.usage }} рет қолданылған</span>
                </div>
              </div>
            </div>
            <div class="word-actions">
              <button class="word-action" @click.stop="incrementUsage(word.text)">
                <Plus :size="16" />
              </button>
              <button class="word-action delete" @click.stop="deleteWord(word.text)">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-if="frequentWords.length === 0" class="empty-state">
          <div class="empty-icon">
            <Inbox :size="64" :stroke-width="1" />
          </div>
          <p>Әзірге сөздер жоқ</p>
          <small>Төмендегі форма арқылы жаңа сөз қосыңыз</small>
        </div>
      </div>
    </div>

    <!-- Жаңа сөз қосу карточкасы -->
    <div class="add-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <PlusCircle :size="20" />
            <h3>Жаңа сөз қосу</h3>
          </div>
        </div>
        
        <div class="add-form">
          <div class="form-row">
            <div class="form-group">
              <label>Сөз (қазақша)</label>
              <div class="input-icon">
                <FileText :size="16" class="icon" />
                <input 
                  v-model="newWord.text" 
                  type="text" 
                  placeholder="Мысалы: Кешіріңіз"
                  @keyup.enter="addNewWord"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Мысал сөйлем</label>
              <div class="input-icon">
                <MessageSquare :size="16" class="icon" />
                <input 
                  v-model="newWord.example" 
                  type="text" 
                  placeholder="Мысалы: Кешіріңіз, мен кешіктім"
                  @keyup.enter="addNewWord"
                />
              </div>
            </div>
          </div>
          <button class="add-btn" @click="addNewWord">
            <Plus :size="16" />
            <span>Сөзді қосу</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Ұсыныс -->
    <div class="tip-card">
      <div class="tip-icon">
        <Lightbulb :size="20" />
      </div>
      <div class="tip-content">
        <strong>Кеңес:</strong> Сөзді басыңыз - көшіру үшін. Жиі қолданылатын сөздер жоғарыда көрсетіледі.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Lucide иконкаларын импорттау
import { 
  Star, BarChart3, Download, FileText, Flame, Trophy, TrendingUp,
  Bookmark, ArrowUpDown, MousePointerClick, Plus, Trash2, Inbox,
  PlusCircle, MessageSquare, Lightbulb
} from 'lucide-vue-next'

// Деректер
const frequentWords = ref([
  { text: 'Сәлем', example: 'Сәлем, қалайсың?', usage: 156 },
  { text: 'Рахмет', example: 'Көмегіңізге рахмет!', usage: 142 },
  { text: 'Қалайсың?', example: 'Қалайсың, досым?', usage: 98 },
  { text: 'Мен', example: 'Мен студентпін', usage: 87 },
  { text: 'Үйге', example: 'Үйге барамын', usage: 76 },
  { text: 'Барамын', example: 'Мектепке барамын', usage: 65 },
  { text: 'Иә', example: 'Иә, келісемін', usage: 54 },
  { text: 'Жоқ', example: 'Жоқ, рахмет', usage: 48 }
])

const newWord = ref({ text: '', example: '' })
const sortOrder = ref('usage') // usage, alphabet

// Статистика
const totalUsage = computed(() => {
  return frequentWords.value.reduce((sum, w) => sum + w.usage, 0)
})

const topWord = computed(() => {
  if (frequentWords.value.length === 0) return '-'
  const top = [...frequentWords.value].sort((a, b) => b.usage - a.usage)[0]
  return top.text
})

const getTodayAdded = computed(() => {
  return Math.floor(Math.random() * 5) + 1
})

// Сұрыпталған сөздер
const sortedWords = computed(() => {
  if (sortOrder.value === 'usage') {
    return [...frequentWords.value].sort((a, b) => b.usage - a.usage)
  } else {
    return [...frequentWords.value].sort((a, b) => a.text.localeCompare(b.text))
  }
})

// Рейтинг
const getRank = (text) => {
  const sorted = [...frequentWords.value].sort((a, b) => b.usage - a.usage)
  const index = sorted.findIndex(w => w.text === text)
  return index + 1
}

// Пайыздық мөлшер
const getUsagePercent = (usage) => {
  const maxUsage = Math.max(...frequentWords.value.map(w => w.usage))
  return (usage / maxUsage) * 100
}

// Сұрыптауды өзгерту
const sortWords = () => {
  sortOrder.value = sortOrder.value === 'usage' ? 'alphabet' : 'usage'
}

// Сөз қосу
const addNewWord = () => {
  if (!newWord.value.text.trim()) {
    alert('Сөзді толтырыңыз!')
    return
  }
  
  if (!newWord.value.example.trim()) {
    newWord.value.example = `${newWord.value.text} - мысал сөйлем`
  }
  
  const exists = frequentWords.value.some(w => w.text === newWord.value.text)
  if (exists) {
    alert('Бұл сөз бұрын қосылған!')
    return
  }
  
  frequentWords.value.push({
    text: newWord.value.text,
    example: newWord.value.example,
    usage: 0
  })
  
  localStorage.setItem('frequentWords', JSON.stringify(frequentWords.value))
  
  newWord.value = { text: '', example: '' }
  alert('Сөз сәтті қосылды!')
}

// Қолдану санын арттыру
const incrementUsage = (text) => {
  const word = frequentWords.value.find(w => w.text === text)
  if (word) {
    word.usage++
    localStorage.setItem('frequentWords', JSON.stringify(frequentWords.value))
  }
}

// Сөз өшіру
const deleteWord = (text) => {
  if (confirm(`"${text}" сөзін өшіргіңіз келеді ме?`)) {
    frequentWords.value = frequentWords.value.filter(w => w.text !== text)
    localStorage.setItem('frequentWords', JSON.stringify(frequentWords.value))
  }
}

// Сөзді көшіру
const copyWord = (text) => {
  navigator.clipboard.writeText(text)
  alert(`"${text}" көшірілді!`)
}

// Экспорт
const exportWords = () => {
  const data = JSON.stringify(frequentWords.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `frequent_words_${new Date().toISOString().slice(0, 19)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Деректерді жүктеу
const loadData = () => {
  const saved = localStorage.getItem('frequentWords')
  if (saved) {
    frequentWords.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.frequent-container {
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
  color: #f59e0b;
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

.export-btn {
  background: #f1f5f9;
  border: none;
  border-radius: 40px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
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

/* ========== НЕГІЗГІ КАРТОЧКА ========== */
.frequent-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.frequent-card:hover {
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

.sort-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 18px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

/* ========== СӨЗДЕР ТОРЫ ========== */
.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.word-card {
  background: #f8fafc;
  border-radius: 24px;
  padding: 18px;
  display: flex;
  gap: 12px;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
  cursor: pointer;
  position: relative;
}

.word-card:hover {
  background: white;
  border-color: #e2e8f0;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px -12px rgba(0, 0, 0, 0.15);
}

.word-rank {
  font-size: 20px;
  font-weight: 700;
  color: #cbd5e1;
  min-width: 36px;
  text-align: center;
}

.word-content {
  flex: 1;
}

.word-text {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.word-example {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;
}

.word-usage {
  margin-top: 8px;
}

.usage-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.usage-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s;
}

.usage-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
}

.word-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.word-action {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.5;
  color: #64748b;
}

.word-action:hover {
  opacity: 1;
  background: #eef2ff;
  color: #6366f1;
}

.word-action.delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* ========== ҚОСУ КАРТОЧКАСЫ ========== */
.add-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
}

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

.input-icon input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}

.input-icon input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon input:focus + .icon {
  color: #6366f1;
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

/* ========== КЕҢЕС ========== */
.tip-card {
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-icon {
  color: #f59e0b;
}

.tip-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.tip-content strong {
  color: #6366f1;
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
  
  .words-grid {
    grid-template-columns: 1fr;
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
  
  .word-card {
    flex-wrap: wrap;
  }
  
  .word-actions {
    flex-direction: row;
    position: absolute;
    top: 12px;
    right: 12px;
  }
}
</style>