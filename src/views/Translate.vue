<template>
  <div class="translate-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <Languages :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 data-i18n="translate_title">Аударма</h1>
          <p data-i18n="translate_subtitle">Мәтінді қазақ ым тіліне аударыңыз</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <BarChart3 :size="16" />
          <span><span data-i18n="today">Бүгін</span>: {{ todayCount }} <span data-i18n="stat_translations">аударма</span></span>
        </div>
        <div class="stat-badge">
          <Award :size="16" />
          <span>7 <span data-i18n="day_streak">күндік серия</span></span>
        </div>
      </div>
    </div>

    <!-- Негізгі грид -->
    <div class="translate-grid">
      <!-- Сол жақ: Мәтін енгізу -->
      <div class="input-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <FileText :size="20" />
              <h3 data-i18n="enter_text">Мәтін енгізіңіз</h3>
            </div>
            <button class="translate-btn" @click="translateText">
              <Languages :size="16" />
              <span data-i18n="translate_btn">Аудару</span>
            </button>
          </div>

          <div class="input-wrapper">
            <textarea 
              v-model="inputText" 
              rows="6" 
              :placeholder="t('enter_text_placeholder')"
              class="styled-textarea"
            ></textarea>
          </div>

          <div class="translate-action-row">
            <button class="translate-btn" @click="translateText">
              <Languages :size="16" />
              <span data-i18n="translate_btn">Аудару</span>
            </button>
          </div>

          <div class="voice-section">
            <button class="voice-btn" @click="startVoiceInput">
              <Mic :size="16" />
              <span data-i18n="voice_btn">Дауыспен сөйлеңіз</span>
            </button>
            <span class="voice-hint" data-i18n="or_type">немесе мәтінді жазыңыз</span>
          </div>
        </div>
      </div>

      <!-- Оң жақ: Аударма нәтижесі -->
      <div class="output-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              <Sparkles :size="20" />
              <h3 data-i18n="translation_result">Аударма нәтижесі</h3>
            </div>
            <div class="ai-badge">
              <Brain :size="14" />
              <span data-i18n="ai_badge">AI ым тілі</span>
            </div>
          </div>

          <div class="output-wrapper">
            <div class="result-box">
              <div v-html="translatedText" class="result-text"></div>
              <div class="video-results" v-if="videoEntries.length">
                <div class="video-card">
                  <p class="video-label">
                    {{ currentVideoEntry?.kazakh || currentVideoEntry?.text || currentVideoEntry?.russian }}
                    <span v-if="currentVideoEntry?.russian && currentVideoEntry?.kazakh" class="video-subtitle">({{ currentVideoEntry?.russian }})</span>
                  </p>
                  <video
                    ref="videoPlayer"
                    :src="getVideoUrl(currentVideoEntry)"
                    controls
                    playsinline
                    muted
                    autoplay
                    @ended="nextVideo"
                    class="video-player"
                  ></video>
                  <div class="video-step" v-if="videoEntries.length > 1">
                    <button class="step-btn" @click="prevVideo" :disabled="currentVideoIndex === 0">Алдыңғы</button>
                    <span>{{ currentVideoIndex + 1 }} / {{ videoEntries.length }}</span>
                    <button class="step-btn" @click="nextVideo" :disabled="currentVideoIndex === videoEntries.length - 1">Келесі</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="animation-toggle-row">
            <label class="toggle-label">
              <input type="checkbox" v-model="dactylMode" />
              <span>{{ t('dactyl_toggle_label') }}</span>
            </label>
            <span class="toggle-description">{{ dactylMode ? t('dactyl_toggle_description') : t('video_toggle_description') }}</span>
          </div>

          <div class="action-buttons" v-if="showActions">
            <button class="action-btn copy" @click="copyResult">
              <Copy :size="14" />
              <span data-i18n="copy">Көшіру</span>
            </button>
            <button class="action-btn speak" @click="speakResult">
              <Volume2 :size="14" />
              <span data-i18n="speak">Оқу</span>
            </button>
            <button class="action-btn share" @click="shareResult">
              <Share2 :size="14" />
              <span data-i18n="share">Бөлісу</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="animation-module">
      <AnimationDemo
        :mode="animationMode"
        :text="inputText"
        :phrase="currentVideoEntry?.kazakh || currentVideoEntry?.text || inputText"
        :video-url="getVideoUrl(currentVideoEntry)"
      />
    </div>

    <!-- Ұсынылатын сөздер -->
    <div class="suggestions-card">
      <div class="card-gradient"></div>
      <div class="card-header">
        <div class="header-left">
          <Lightbulb :size="20" />
          <h3 data-i18n="suggested_words">Ұсынылатын сөздер</h3>
        </div>
        <button class="refresh-btn" @click="refreshSuggestions">
          <RefreshCw :size="16" />
        </button>
      </div>
      
      <div class="suggestions-grid">
        <div 
          v-for="word in suggestedWords" 
          :key="word"
          class="suggestion-chip"
          @click="addWord(word)"
        >
          <span class="chip-icon">{{ getWordIcon(word) }}</span>
          <span class="chip-text">{{ word }}</span>
        </div>
      </div>
      
      <div class="suggestions-note">
        <MousePointerClick :size="12" />
        <span class="note-text" data-i18n="click_to_add">Сөзді басыңыз - мәтінге қосылады</span>
      </div>
    </div>

    <!-- Соңғы аудармалар -->
    <div class="recent-card" v-if="recentTranslations.length > 0">
      <div class="card-gradient"></div>
      <div class="card-header">
        <div class="header-left">
          <Clock :size="20" />
          <h3 data-i18n="recent_translations">Соңғы аудармалар</h3>
        </div>
        <button class="clear-btn" @click="clearRecent">
          <Trash2 :size="16" />
        </button>
      </div>
      
      <div class="recent-list">
        <div 
          v-for="(item, index) in recentTranslations" 
          :key="index"
          class="recent-item"
          @click="loadRecentText(item.text)"
        >
          <div class="recent-text">
            <MessageSquare :size="14" />
            <span>{{ truncateText(item.text, 50) }}</span>
          </div>
          <div class="recent-date">
            <Calendar :size="12" />
            <span>{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import apiClient from '../api'
import { useAuthStore } from '../stores/auth'
import { useDictionaryStore } from '../stores/dictionary'
import { t, loadLanguage, translatePage, currentLanguage } from '../i18n'
import AnimationDemo from '../components/AnimationDemo.vue'

// Lucide иконкаларын импорттау
import { 
  Languages, BarChart3, Award, FileText, Mic, Sparkles, Brain,
  Copy, Volume2, Share2, Lightbulb, RefreshCw, MousePointerClick,
  Clock, Trash2, MessageSquare, Calendar
} from 'lucide-vue-next'

// Деректер
const inputText = ref(localStorage.getItem('inputText') || '')
const translatedText = ref(t('no_result'))
const showActions = ref(false)
const recentTranslations = ref([])
const todayCount = ref(24)
const videoEntries = ref([])
const currentVideoIndex = ref(0)
const videoPlayer = ref(null)
const dactylMode = ref(false)
const dictionaryStore = useDictionaryStore()
const currentVideoEntry = computed(() => videoEntries.value[currentVideoIndex.value] || null)
const animationMode = computed(() => dactylMode.value ? 'dactyl' : 'video')

// Ұсынылатын сөздер
const baseSuggestions = ['Сәлем', 'Рахмет', 'Қалайсың?', 'Мен', 'Үйге', 'Барамын', 'Иә', 'Жоқ', 'Көмек', 'Кешіріңіз']
const suggestedWords = ref([...baseSuggestions])

// Сөзге иконка тағайындау
const getWordIcon = (word) => {
  const icons = {
    'Сәлем': '👋',
    'Рахмет': '🙏',
    'Қалайсың?': '🤔',
    'Мен': '👤',
    'Үйге': '🏠',
    'Барамын': '🚶',
    'Иә': '✅',
    'Жоқ': '❌',
    'Көмек': '🆘',
    'Кешіріңіз': '😔'
  }
  return icons[word] || '📝'
}

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\u0400-\u04FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const findMatchingDictionaryEntries = (text) => {
  const normalized = normalizeText(text)
  const uiLang = currentLanguage.value || 'kk'

  // Build lookup maps for phrases -> entry (normalized)
  const kazakhMap = new Map()
  const russianMap = new Map()
  let maxPhraseWords = 1

  dictionaryStore.dictionary.forEach((entry) => {
    const kaz = normalizeText(entry.kazakh || entry.text || '')
    const rus = normalizeText(entry.russian || '')
    if (kaz) {
      kazakhMap.set(kaz, entry)
      const w = kaz.split(' ').length
      if (w > maxPhraseWords) maxPhraseWords = w
    }
    if (rus) {
      russianMap.set(rus, entry)
      const w2 = rus.split(' ').length
      if (w2 > maxPhraseWords) maxPhraseWords = w2
    }
  })

  // Tokenize input
  const words = normalized.split(' ').filter(Boolean)
  const results = []
  const seenIds = new Set()

  for (let i = 0; i < words.length; i++) {
    let matched = false
    // try longest phrases first
    for (let len = Math.min(maxPhraseWords, words.length - i); len >= 1; len--) {
      const slice = words.slice(i, i + len).join(' ')
      let entry = null
      if (uiLang === 'ru') {
        entry = russianMap.get(slice)
      } else if (uiLang === 'kk') {
        entry = kazakhMap.get(slice)
      } else {
        entry = kazakhMap.get(slice) || russianMap.get(slice)
      }

      if (entry && !seenIds.has(entry.id || (entry.kazakh + '|' + entry.russian))) {
        results.push(entry)
        seenIds.add(entry.id || (entry.kazakh + '|' + entry.russian))
        i += len - 1
        matched = true
        break
      }
    }
    if (!matched) continue
  }

  return results
}

const getVideoUrl = (entry) => {
  return entry?.video_url || entry?.video || entry?.links?.[0] || ''
}

const nextVideo = () => {
  if (currentVideoIndex.value < videoEntries.value.length - 1) {
    currentVideoIndex.value += 1
  }
}

const prevVideo = () => {
  if (currentVideoIndex.value > 0) {
    currentVideoIndex.value -= 1
  }
}

watch(videoEntries, () => {
  currentVideoIndex.value = 0
})

// Автозапуск видео при смене текущего видео
watch(currentVideoEntry, async () => {
  await nextTick()
  if (videoPlayer.value) {
    videoPlayer.value.play().catch(() => {})
  }
})

// Текстті қысқарту
const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
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
const translateText = async () => {
  if (!inputText.value.trim()) {
    translatedText.value = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>${t('enter_text')}</p>
        <small>${t('or_type')}</small>
      </div>
    `
    showActions.value = false
    videoEntries.value = []
    return
  }
  
  const authStore = useAuthStore()
  const translation = `🧏‍♂️ "${inputText.value}" - ${t('translated')}`
  translatedText.value = translation
  
  // Search in local dictionary first
  videoEntries.value = findMatchingDictionaryEntries(inputText.value)
  currentVideoIndex.value = 0
  
  // If no local videos found, try API
  if (!videoEntries.value || videoEntries.value.length === 0) {
    try {
      const words = normalizeText(inputText.value).split(' ').filter(Boolean)
      for (const word of words) {
        try {
          const response = await apiClient.get(`/api/sign-videos/${encodeURIComponent(word)}`)
          if (response.data) {
            videoEntries.value.push(response.data)
          }
        } catch (error) {
          // Word not found in API, continue to next word
          console.log(`No video found for word: ${word}`)
        }
      }
    } catch (error) {
      console.error('Error fetching from API:', error)
    }
  }
  
  await nextTick()

  // If we found videos, hide the textual translation and try to autoplay the first one
  if (videoEntries.value && videoEntries.value.length > 0) {
    translatedText.value = ''
    if (videoPlayer.value) {
      videoPlayer.value.play().catch(() => {})
    }
  }
  
  if (authStore.isLoggedIn) {
    try {
      await apiClient.post('/api/history', {
        text: inputText.value,
        translation: translation
      })
      
      const response = await apiClient.get('/api/history')
      recentTranslations.value = response.data.slice(0, 5).map(item => ({
        text: item.text,
        translation: item.translation,
        date: new Date(item.created_at).toLocaleString()
      }))
    } catch (error) {
      console.error('Error saving translation:', error)
      saveToLocalStorage()
    }
  } else {
    saveToLocalStorage()
  }
  
  showActions.value = true
}

const saveToLocalStorage = () => {
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  history.unshift({
    text: inputText.value,
    translation: `🧏‍♂️ "${inputText.value}" - ${t('translated')}`,
    date: new Date().toLocaleString()
  })
  localStorage.setItem('translationHistory', JSON.stringify(history.slice(0, 50)))
  recentTranslations.value = history.slice(0, 5)
}

// Дауыстық енгізу
const startVoiceInput = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = currentLanguage.value === 'ru' ? 'ru-RU' : 'kk-KZ'
    recognition.continuous = false
    
    recognition.start()
    
    recognition.onresult = (event) => {
      inputText.value = event.results[0][0].transcript
    }
    
    recognition.onerror = () => {
      alert(t('voice_error'))
    }
  } else {
    alert(t('voice_not_supported'))
  }
}

// Нәтижені көшіру
const copyResult = () => {
  navigator.clipboard.writeText(inputText.value)
  alert(t('copied'))
}

// Нәтижені оқу
const speakResult = () => {
  const utterance = new SpeechSynthesisUtterance(inputText.value)
  utterance.lang = currentLanguage.value === 'ru' ? 'ru-RU' : 'kk-KZ'
  speechSynthesis.speak(utterance)
}

// Бөлісу
const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: t('share_title'),
      text: inputText.value,
    })
  } else {
    alert(t('share_not_supported'))
  }
}

// Ұсыныстарды жаңарту
const refreshSuggestions = () => {
  const newWords = ['Сәлеметсіз бе', 'Қош келдіңіз', 'Сау болыңыз', 'Түсінікті', 'Қайталаңыз']
  suggestedWords.value = [...newWords, ...baseSuggestions.slice(0, 5)]
  setTimeout(() => {
    suggestedWords.value = [...baseSuggestions]
  }, 3000)
}

// Соңғы аударманы жүктеу
const loadRecentText = (text) => {
  inputText.value = text
  translateText()
}

// Соңғы аудармаларды тазалау
const clearRecent = () => {
  recentTranslations.value = []
}

// Соңғы аудармаларды жүктеу
const loadRecent = async () => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    try {
      const response = await apiClient.get('/api/history')
      recentTranslations.value = response.data.slice(0, 5).map(item => ({
        text: item.text,
        translation: item.translation,
        date: new Date(item.created_at).toLocaleString()
      }))
    } catch (error) {
      console.error('Error loading recent:', error)
      const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
      recentTranslations.value = history.slice(0, 5)
    }
  } else {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
    recentTranslations.value = history.slice(0, 5)
  }
}

onMounted(async () => {
  await dictionaryStore.loadFromLocalStorage()
  loadRecent()
  loadLanguage()
  translatePage()
  
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
})

watch(inputText, (newValue) => {
  localStorage.setItem('inputText', newValue)
})
</script>

<style scoped>
.translate-container {
  width: 100%;
}

.animation-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 8px;
  flex-wrap: wrap;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #eef2ff;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
  color: #1d4ed8;
}

.toggle-label input {
  width: 18px;
  height: 18px;
}

.toggle-description {
  color: #64748b;
  font-size: 13px;
}

.animation-module {
  margin: 18px auto 24px;
  max-width: 980px;
  display: flex;
  justify-content: center;
}

.animation-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 8px;
  flex-wrap: wrap;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #eef2ff;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
  color: #1d4ed8;
}

.toggle-label input {
  width: 18px;
  height: 18px;
}

.toggle-description {
  color: #64748b;
  font-size: 13px;
}

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

/* ========== НЕГІЗГІ ГРИД ========== */
.translate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* ========== КАРТОЧКАЛАР ========== */
.input-card, .output-card, .suggestions-card, .recent-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.input-card:hover, .output-card:hover, .suggestions-card:hover, .recent-card:hover {
  transform: translateY(-4px);
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
  flex-wrap: wrap;
  gap: 12px;
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

/* ========== АУДАРУ БАТЫРМАСЫ ========== */
.translate-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  padding: 8px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.translate-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.translate-action-row {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.translate-action-row .translate-btn {
  width: 100%;
  justify-content: center;
}

/* ========== AI БЕЙДЖИ ========== */
.ai-badge {
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  border-radius: 40px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #6366f1;
}

/* ========== TEXTAREA ========== */
.input-wrapper {
  margin-bottom: 16px;
}

.styled-textarea {
  width: 100%;
  padding: 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  background: #fafcff;
  line-height: 1.6;
}

.styled-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: white;
}

/* ========== ДАУЫС БӨЛІМІ ========== */
.voice-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f2f5;
}

.voice-btn {
  background: #f1f5f9;
  border: none;
  padding: 10px 20px;
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

.voice-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

.voice-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* ========== НӘТИЖЕ БЛОГЫ ========== */
.output-wrapper {
  margin-bottom: 16px;
}

.result-box {
  min-height: 200px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-results {
  margin-top: 20px;
  display: grid;
  gap: 16px;
}

.video-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 14px;
  background: #ffffff;
}

.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 240px;
  object-fit: cover;
  border-radius: 16px;
  background: #000;
}

.video-step {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #475569;
}

.step-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-text {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.5;
}

.result-status {
  font-size: 13px;
  color: #10b981;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.empty-state small {
  font-size: 12px;
  color: #94a3b8;
}

/* ========== ӘРЕКЕТ БАТЫРМАЛАРЫ ========== */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 18px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.copy:hover {
  background: #eef2ff;
  color: #6366f1;
}

.action-btn.speak:hover {
  background: #dcfce7;
  color: #16a34a;
}

.action-btn.share:hover {
  background: #fff3e3;
  color: #f59e0b;
}

/* ========== ҰСЫНЫСТАР ========== */
.suggestions-card {
  margin-bottom: 24px;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 24px 20px 24px;
}

.suggestion-chip {
  background: #f8fafc;
  border: 1px solid #eef2f6;
  border-radius: 40px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  background: #eef2ff;
  border-color: #6366f1;
  transform: translateY(-2px);
}

.chip-icon {
  font-size: 16px;
}

.chip-text {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.suggestion-chip:hover .chip-text {
  color: #6366f1;
}

.suggestions-note {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 24px 20px 24px;
}

.note-text {
  font-size: 12px;
  color: #94a3b8;
}

/* ========== СОҢҒЫ АУДАРМАЛАР ========== */
.recent-list {
  padding: 8px 0;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f2f5;
  gap: 12px;
  flex-wrap: wrap;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background: #f8fafc;
}

.recent-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  flex: 1;
}

.recent-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
}

.refresh-btn, .clear-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.refresh-btn:hover, .clear-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .translate-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .suggestions-grid {
    gap: 10px;
  }
  
  .suggestion-chip {
    padding: 6px 14px;
  }
}

@media (max-width: 500px) {
  .card-content {
    padding: 18px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .recent-item {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ========== ТЁМНЫЙ РЕЖИМ ========== */
:root.dark-theme .translate-container {
  background: #0f172a;
}

:root.dark-theme .stat-badge,
:root.dark-theme .input-card,
:root.dark-theme .output-card,
:root.dark-theme .suggestions-card,
:root.dark-theme .recent-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}

:root.dark-theme .header-content h1,
:root.dark-theme .card-header h3,
:root.dark-theme .result-text {
  color: #f1f5f9 !important;
}

:root.dark-theme .header-content p,
:root.dark-theme .voice-hint,
:root.dark-theme .note-text,
:root.dark-theme .recent-date {
  color: #94a3b8 !important;
}

:root.dark-theme .styled-textarea {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f1f5f9 !important;
}

:root.dark-theme .styled-textarea::placeholder {
  color: #94a3b8 !important;
}

:root.dark-theme .result-box {
  background: #1e293b !important;
}

:root.dark-theme .action-btn,
:root.dark-theme .voice-btn,
:root.dark-theme .refresh-btn,
:root.dark-theme .clear-btn {
  background: #334155 !important;
  color: #cbd5e1 !important;
}

:root.dark-theme .action-btn:hover,
:root.dark-theme .voice-btn:hover,
:root.dark-theme .refresh-btn:hover,
:root.dark-theme .clear-btn:hover {
  background: #475569 !important;
  color: #a78bfa !important;
}

:root.dark-theme .ai-badge,
:root.dark-theme .badge {
  background: #334155 !important;
  color: #a78bfa !important;
}

:root.dark-theme .suggestion-chip {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #cbd5e1 !important;
}

:root.dark-theme .suggestion-chip:hover {
  background: #475569 !important;
  color: #a78bfa !important;
}

:root.dark-theme .recent-item {
  border-bottom-color: #334155 !important;
}

:root.dark-theme .recent-item:hover {
  background: #334155 !important;
}

.video-results {
  margin-top: 20px;
}

.video-title {
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.video-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  background: #ffffff;
}

.video-label {
  margin-bottom: 10px;
  font-weight: 600;
  color: #1f2937;
}

.video-player {
  width: 100%;
  border-radius: 14px;
  background: #000;
}

.video-link {
  display: inline-block;
  margin-top: 10px;
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}

.video-link:hover {
  text-decoration: underline;
}

:root.dark-theme .video-card {
  background: #0f172a !important;
  border-color: #334155 !important;
}

:root.dark-theme .video-label {
  color: #f1f5f9 !important;
}

</style>