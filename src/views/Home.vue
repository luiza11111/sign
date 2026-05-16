<template>
  <div class="home-container">
    <!-- Қош келдіңіз хабарламасы -->
    <div class="welcome-section">
      <div class="welcome-left">
        <div class="welcome-icon">
          <Hand :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1>Қош келдіңіз, {{ userName }}!</h1>
          <p>Бүгін не аударамыз?</p>
        </div>
      </div>
      <div class="welcome-stats">
        <div class="welcome-badge">
          <Award :size="16" />
          <span>7 күндік серия</span>
        </div>
      </div>
    </div>

    <!-- Статистика карточкалары -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <Target :size="28" :stroke-width="1.5" />
        </div>
        <div class="stat-info">
          <h3>{{ totalTranslations }}</h3>
          <p>Аударылған сөз</p>
        </div>
        <div class="stat-change up">
          <TrendingUp :size="12" />
          <span>12%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <Mic :size="28" :stroke-width="1.5" />
        </div>
        <div class="stat-info">
          <h3>{{ voiceRequests }}</h3>
          <p>Дауыстық сұрау</p>
        </div>
        <div class="stat-change up">
          <TrendingUp :size="12" />
          <span>8%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple">
          <Star :size="28" :stroke-width="1.5" />
        </div>
        <div class="stat-info">
          <h3>{{ frequentWordsCount }}</h3>
          <p>Жиі қолданылатын</p>
        </div>
        <div class="stat-change up">
          <TrendingUp :size="12" />
          <span>5%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <Calendar :size="28" :stroke-width="1.5" />
        </div>
        <div class="stat-info">
          <h3>{{ todayActivity }}</h3>
          <p>Бүгінгі белсенділік</p>
        </div>
        <div class="stat-change down">
          <TrendingDown :size="12" />
          <span>3%</span>
        </div>
      </div>
    </div>

    <!-- Негізгі екі баған -->
    <div class="content-grid">
      <!-- Сол жақ: Мәтін енгізу -->
      <div class="card">
        <div class="card-gradient"></div>
        <div class="card-header">
          <div class="header-left">
            <FileText :size="20" />
            <h3>Мәтін енгізіңіз</h3>
          </div>
          <button class="translate-btn" @click="translateText">
            <Languages :size="16" />
            <span>Аудару</span>
          </button>
        </div>
        <div class="textarea-wrapper">
          <textarea 
            v-model="inputText" 
            rows="5" 
            placeholder="Сәлем! Қалайсың? Мен бүгін университетке барамын..."
          ></textarea>
        </div>
        <div class="voice-row">
          <button class="voice-btn" @click="startVoiceInput">
            <Mic :size="16" />
            <span>Дауыспен сөйлеңіз</span>
          </button>
          <span class="hint">немесе мәтінді жазыңыз</span>
        </div>
      </div>

      <!-- Оң жақ: Аударма нәтижесі -->
      <div class="card">
        <div class="card-gradient"></div>
        <div class="card-header">
          <div class="header-left">
            <Sparkles :size="20" />
            <h3>Аударма нәтижесі</h3>
          </div>
          <div class="badge">
            <Brain :size="12" />
            <span>AI ым тілі</span>
          </div>
        </div>
        <div class="result-box" v-html="translatedText"></div>
        <div class="action-buttons" v-if="showActions">
          <button class="action-btn copy" @click="copyResult">
            <Copy :size="14" />
            <span>Көшіру</span>
          </button>
          <button class="action-btn speak" @click="speakResult">
            <Volume2 :size="14" />
            <span>Оқу</span>
          </button>
          <button class="action-btn share" @click="shareResult">
            <Share2 :size="14" />
            <span>Бөлісу</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Жиі қолданылатын сөздер -->
    <div class="card full-width">
      <div class="card-gradient"></div>
      <div class="card-header">
        <div class="header-left">
          <Bookmark :size="20" />
          <h3>Жиі қолданылатын сөздер</h3>
        </div>
        <button class="filter-btn" @click="loadMoreWords">
          <Plus :size="14" />
          <span>Көбірек</span>
        </button>
      </div>
      <div class="word-cloud">
        <span 
          v-for="word in commonWords" 
          :key="word"
          class="word-tag" 
          @click="addWord(word)"
        >
          {{ word }}
        </span>
      </div>
      <div class="word-note">
        <MousePointerClick :size="12" />
        <span>Сөзді басыңыз - мәтінге қосылады</span>
      </div>
    </div>
  </div>

  <!-- ========== ТҰРАҚТЫ ФЛОАТТЫ РЕСУРСТАР БАТЫРМАСЫ ========== -->
  <div class="resources-float">
    <button class="float-btn" @click="showResourcesModal = true">
      <BookOpen :size="22" />
      <span class="float-text">Ресурсы</span>
    </button>
    
    <!-- Модальды терезе -->
    <div v-if="showResourcesModal" class="modal-overlay" @click="showResourcesModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <BookOpen :size="24" />
            <span>Вспомогательные ресурсы</span>
          </div>
          <button class="modal-close" @click="showResourcesModal = false">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <a href="#" class="modal-item">
            <Book :size="28" />
            <div class="modal-item-info">
              <strong>Қазақ ым тілінің негіздері</strong>
              <small>Әліппе мен негізгі сөздер</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <Video :size="28" />
            <div class="modal-item-info">
              <strong>Бейне сабақтар</strong>
              <small>Видео нұсқаулықтар жинағы</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <Smartphone :size="28" />
            <div class="modal-item-info">
              <strong>Мобильді қосымша</strong>
              <small>Android және iOS нұсқалары</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <MessageCircle :size="28" />
            <div class="modal-item-info">
              <strong>Telegram бот</strong>
              <small>Күнделікті жаттығулар</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <Globe :size="28" />
            <div class="modal-item-info">
              <strong>Қауымдастық форум</strong>
              <small>Пікірлер мен сұрақтар</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <FileText :size="28" />
            <div class="modal-item-info">
              <strong>PDF нұсқаулық</strong>
              <small>Жүктеп алуға арналған</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

// Lucide иконкаларын импорттау
import { 
  Hand, Award, Target, TrendingUp, Mic, TrendingDown, Star, Calendar,
  FileText, Languages, Sparkles, Brain, Copy, Volume2, Share2,
  Bookmark, Plus, MousePointerClick, BookOpen, X, Book, Video,
  Smartphone, MessageCircle, Globe, ArrowRight
} from 'lucide-vue-next'

const authStore = useAuthStore()

// Қолданушы аты
const userName = computed(() => authStore.user?.name || 'Қолданушы')

// Статистика деректері
const totalTranslations = ref(0)
const voiceRequests = ref(0)
const frequentWordsCount = ref(0)
const todayActivity = ref(0)

// Аударма деректері
const inputText = ref(localStorage.getItem('inputText') || '')
const translatedText = ref('Мәтін енгізіп, аударыңыз')
const showActions = ref(false)

// Жиі сөздер
const commonWords = ref(['Сәлем', 'Рахмет', 'Қалайсың?', 'Мен', 'Үйге', 'Барамын', 'Иә', 'Жоқ', 'Көмек', 'Рахмет'])

// Модальды терезе
const showResourcesModal = ref(false)

// Статистиканы жүктеу
const loadStats = () => {
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  totalTranslations.value = history.length
  
  voiceRequests.value = Math.floor(Math.random() * 100) + 20
  
  const dictionary = JSON.parse(localStorage.getItem('signDictionary') || '[]')
  frequentWordsCount.value = dictionary.length
  
  todayActivity.value = Math.floor(Math.random() * 30) + 5
}

// Сөз қосу
const addWord = (word) => {
  if (inputText.value.trim() === '') {
    inputText.value = word
  } else {
    inputText.value += ' ' + word
  }
}

// Аудару
const translateText = () => {
  if (!inputText.value.trim()) {
    translatedText.value = '❗ Мәтінді енгізіңіз...'
    showActions.value = false
    return
  }
  
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  history.unshift({
    text: inputText.value,
    translation: `🧏‍♂️ "${inputText.value}" - Қазақ ым тіліне аударылды`,
    date: new Date().toLocaleString()
  })
  localStorage.setItem('translationHistory', JSON.stringify(history.slice(0, 50)))
  
  translatedText.value = `
    <div class="result-content">
      <div class="result-icon">🧏‍♂️</div>
      <div class="result-text">“${inputText.value}”</div>
      <div class="result-status">✅ Қазақ ым тіліне сәтті аударылды</div>
    </div>
  `
  showActions.value = true
  loadStats()
}

// Дауыстық енгізу
const startVoiceInput = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'kk-KZ'
    recognition.continuous = false
    
    recognition.start()
    
    recognition.onresult = (event) => {
      inputText.value = event.results[0][0].transcript
    }
    
    recognition.onerror = () => {
      alert('Дауысты тану мүмкін болмады')
    }
  } else {
    alert('Сіздің браузеріңіз дауыстық енгізуді қолдамайды')
  }
}

// Нәтижені көшіру
const copyResult = () => {
  const text = inputText.value
  navigator.clipboard.writeText(text)
  alert('Көшірілді!')
}

// Нәтижені оқу
const speakResult = () => {
  const text = inputText.value
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'kk-KZ'
  speechSynthesis.speak(utterance)
}

// Бөлісу
const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Аударма нәтижесі',
      text: inputText.value,
    })
  } else {
    alert('Бөлісу мүмкін емес')
  }
}

// Көбірек сөздер
const loadMoreWords = () => {
  const moreWords = ['Кешіріңіз', 'Түсінікті', 'Қайталаңыз', 'Жазыңыз', 'Оқыңыз']
  commonWords.value = [...commonWords.value, ...moreWords]
}

onMounted(() => {
  loadStats()
})

// Сохраняем inputText в localStorage при изменении
watch(inputText, (newValue) => {
  localStorage.setItem('inputText', newValue)
})
</script>

<style scoped>
.home-container {
  width: 100%;
}

/* Қош келдіңіз бөлімі */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.welcome-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.welcome-left h1 {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.welcome-left p {
  font-size: 14px;
  color: #64748b;
}

.welcome-badge {
  background: white;
  border-radius: 40px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #f59e0b;
  border: 1px solid #eef2f6;
}

/* Статистика карточкалары */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #eef2f6;
  transition: all 0.2s ease;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.stat-icon.blue { background: #eef2ff; color: #3b82f6; }
.stat-icon.green { background: #dcfce7; color: #10b981; }
.stat-icon.purple { background: #f3e8ff; color: #8b5cf6; }
.stat-icon.orange { background: #fff3e3; color: #f59e0b; }

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.stat-info p {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.stat-change {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
}

.stat-change.up {
  background: #dcfce7;
  color: #16a34a;
}

.stat-change.down {
  background: #fee2e2;
  color: #ef4444;
}

/* Карточкалар */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: white;
  border-radius: 28px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.card:hover {
  box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.08);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
}

.full-width {
  grid-column: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f0f2f5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.translate-btn, .filter-btn {
  background: #f1f5f9;
  border: none;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.translate-btn:hover, .filter-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

.badge {
  background: #eef2ff;
  color: #6366f1;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Textarea */
.textarea-wrapper {
  padding: 4px;
}

textarea {
  width: 100%;
  padding: 20px 24px;
  border: none;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  line-height: 1.5;
  background: #fafcff;
}

textarea:focus {
  background: white;
}

/* Дауыс жолы */
.voice-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px 20px;
  border-top: 1px solid #f0f2f5;
  background: #fafcff;
}

.voice-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-btn:hover {
  background: #e2e8f0;
}

.hint {
  font-size: 12px;
  color: #94a3b8;
}

/* Нәтиже блогы */
.result-box {
  padding: 32px 24px;
  min-height: 200px;
  background: #fafcff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  text-align: center;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-text {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 12px;
}

.result-status {
  font-size: 13px;
  color: #10b981;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 12px 24px 20px;
  border-top: 1px solid #f0f2f5;
}

.action-btn {
  background: #f1f5f9;
  border: none;
  padding: 6px 14px;
  border-radius: 40px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-btn.copy:hover { color: #6366f1; }
.action-btn.speak:hover { color: #10b981; }
.action-btn.share:hover { color: #f59e0b; }

/* Сөз бұлты */
.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px 24px;
}

.word-tag {
  background: #f1f5f9;
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
  color: #475569;
}

.word-tag:hover {
  background: #eef2ff;
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-2px);
}

.word-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  padding: 0 24px 20px 24px;
}

/* Тұрақты флоатты батырма */
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

.float-text {
  font-size: 14px;
}

/* Модальды терезе */
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

.modal-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f2f5;
  color: #475569;
}

.modal-item:hover {
  background: #f8fafc;
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
  transition: transform 0.2s;
}

.modal-item:hover .modal-item-arrow {
  transform: translateX(4px);
  color: #6366f1;
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

/* Мобильді */
@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .float-text {
    display: none;
  }
  .float-btn {
    padding: 14px;
    border-radius: 50px;
  }
  .welcome-left {
    flex-direction: column;
    text-align: center;
  }
}

/* ========== ТЁМНЫЙ РЕЖИМ ========== */
:root.dark-theme .home-container {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

:root.dark-theme .welcome-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: 24px;
}

:root.dark-theme .welcome-icon {
  background: rgba(99, 102, 241, 0.1);
  color: #8b5cf6;
}

:root.dark-theme .stat-card {
  background: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:root.dark-theme .card {
  background: var(--card-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:root.dark-theme .card-header h3 {
  color: var(--text-primary);
}

:root.dark-theme textarea {
  background: #2a2a3e;
  color: var(--text-primary);
  border-color: var(--border-color);
}

:root.dark-theme textarea:focus {
  background: #3a3a4e;
}

:root.dark-theme .badge {
  background: rgba(99, 102, 241, 0.1);
  color: #8b5cf6;
}

:root.dark-theme .modal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

:root.dark-theme .modal-header {
  background: rgba(99, 102, 241, 0.1);
  border-bottom-color: var(--border-color);
}

:root.dark-theme .modal-title {
  color: #8b5cf6;
}

:root.dark-theme .modal-item {
  border-bottom-color: var(--border-color);
  color: var(--text-primary);
}

:root.dark-theme .modal-item-info strong {
  color: var(--text-primary);
}

:root.dark-theme .modal-item-info small {
  color: var(--text-secondary);
}

:root.dark-theme .footer-btn {
  background: rgba(99, 102, 241, 0.1);
  color: var(--text-primary);
}

:root.dark-theme .footer-btn:hover {
  background: rgba(99, 102, 241, 0.2);
}
</style>