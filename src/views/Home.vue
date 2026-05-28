<template>
  <div class="home-container">
    <!-- Қош келдіңіз хабарламасы -->
    <div class="welcome-section">
      <div class="welcome-left">
        <div class="welcome-icon">
          <Hand :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 data-i18n="welcome">Қош келдіңіз, {{ userName }}!</h1>
          <p data-i18n="what_translate">Бүгін не аударамыз?</p>
        </div>
      </div>
      <div class="welcome-stats">
        <div class="welcome-badge">
          <Award :size="16" />
          <span>{{ streakDays }} <span data-i18n="day_streak">күндік серия</span></span>
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
          <p data-i18n="translated_words">Аударылған сөз</p>
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
          <p data-i18n="voice_requests">Дауыстық сұрау</p>
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
          <p data-i18n="popular_words">Жиі қолданылатын</p>
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
          <p data-i18n="today_activity_home">Бүгінгі белсенділік</p>
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
            <h3 data-i18n="enter_text_home">Мәтін енгізіңіз</h3>
          </div>
          <button class="translate-btn" @click="translateText">
            <Languages :size="16" />
            <span data-i18n="translate_button">Аудару</span>
          </button>
        </div>
        <div class="textarea-wrapper">
          <textarea 
            v-model="inputText" 
            rows="5" 
            :placeholder="t('enter_text_home')"
          ></textarea>
        </div>
        <div class="voice-row">
          <button class="voice-btn" @click="startVoiceInput">
            <Mic :size="16" />
            <span data-i18n="speak_button">Дауыспен сөйлеңіз</span>
          </button>
          <span class="hint" data-i18n="or_type_home">немесе мәтінді жазыңыз</span>
        </div>
      </div>

      <!-- Оң жақ: Аударма нәтижесі -->
      <div class="card">
        <div class="card-gradient"></div>
        <div class="card-header">
          <div class="header-left">
            <Sparkles :size="20" />
            <h3 data-i18n="translation_result">Аударма нәтижесі</h3>
          </div>
          <div class="badge">
            <Brain :size="12" />
            <span data-i18n="ai_badge">AI ым тілі</span>
          </div>
        </div>
        <div class="result-box">
          <div v-html="translatedText"></div>
          <div class="video-results" v-if="videoEntries.length">
            <div class="video-card">
              <!-- no text label above video; only show video -->
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
        <div class="action-buttons" v-if="showActions">
          <button class="action-btn copy" @click="copyResult">
            <Copy :size="14" />
            <span data-i18n="copy">Көшіру</span>
          </button>
          <button class="action-btn speak" @click="speakResult">
            <Volume2 :size="14" />
            <span data-i18n="read">Оқу</span>
          </button>
          <button class="action-btn share" @click="shareResult">
            <Share2 :size="14" />
            <span data-i18n="share">Бөлісу</span>
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
          <h3 data-i18n="frequent_words">Жиі қолданылатын сөздер</h3>
        </div>
        <button class="filter-btn" @click="loadMoreWords">
          <Plus :size="14" />
          <span data-i18n="more_words">Көбірек</span>
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
        <span data-i18n="click_to_add">Сөзді басыңыз - мәтінге қосылады</span>
      </div>
    </div>
  </div>

  <!-- ========== ТҰРАҚТЫ ФЛОАТТЫ РЕСУРСТАР БАТЫРМАСЫ ========== -->
  <div class="resources-float">
    <button class="float-btn" @click="showResourcesModal = true">
      <BookOpen :size="22" />
      <span class="float-text" data-i18n="resources">Ресурстар</span>
    </button>
    
    <!-- Модальды терезе -->
    <div v-if="showResourcesModal" class="modal-overlay" @click="showResourcesModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <BookOpen :size="24" />
            <span data-i18n="resources_title">Көмекші ресурстар</span>
          </div>
          <button class="modal-close" @click="showResourcesModal = false">
            <X :size="18" />
          </button>
        </div>
        <div class="modal-body">
          <button class="modal-item" type="button" @click="router.push('/alphabet')">
            <Book :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_alphabet_title">Қазақ ым тілінің алфавиті</strong>
              <small data-i18n="resource_alphabet_desc">Символдар және қол қимылдары</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </button>
          <a href="/files/kazakh-sign-language-basics.pdf" class="modal-item" target="_blank" rel="noopener noreferrer">
            <Video :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_1_title">Қазақ ым тілінің негіздері</strong>
              <small data-i18n="resource_1_desc">Әліппе мен негізгі сөздер</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <Smartphone :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_3_title">Мобильді қосымша</strong>
              <small data-i18n="resource_3_desc">Android және iOS нұсқалары</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <MessageCircle :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_4_title">Telegram бот</strong>
              <small data-i18n="resource_4_desc">Күнделікті жаттығулар</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="#" class="modal-item">
            <Globe :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_5_title">Қауымдастық форум</strong>
              <small data-i18n="resource_5_desc">Пікірлер мен сұрақтар</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
          <a href="/files/signflow-user-guide.pdf" class="modal-item" target="_blank" rel="noopener noreferrer">
            <FileText :size="28" />
            <div class="modal-item-info">
              <strong data-i18n="resource_6_title">PDF нұсқаулық</strong>
              <small data-i18n="resource_6_desc">Жүктеп алуға арналған</small>
            </div>
            <ArrowRight :size="16" class="modal-item-arrow" />
          </a>
        </div>
        <div class="modal-footer">
          <button class="footer-btn" @click="showResourcesModal = false">
            <span data-i18n="close">Жабу</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDictionaryStore } from '../stores/dictionary'
import { t, loadLanguage, translatePage, currentLanguage } from '../i18n'

// Lucide иконкаларын импорттау
import { 
  Hand, Award, Target, TrendingUp, Mic, TrendingDown, Star, Calendar,
  FileText, Languages, Sparkles, Brain, Copy, Volume2, Share2,
  Bookmark, Plus, MousePointerClick, BookOpen, X, Book, Video,
  Smartphone, MessageCircle, Globe, ArrowRight
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const dictionaryStore = useDictionaryStore()

// Қолданушы аты
const userName = computed(() => authStore.user?.name || 'Қолданушы')

// ========== НАҚТЫ АНАЛИТИКА ДЕРЕКТЕРІ ==========
const totalTranslations = ref(0)
const voiceRequests = ref(0)
const frequentWordsCount = ref(0)
const todayActivity = ref(0)
const streakDays = ref(0)
const videoEntries = ref([])
const currentVideoIndex = ref(0)
const videoPlayer = ref(null)
const currentVideoEntry = computed(() => videoEntries.value[currentVideoIndex.value] || null)

// Өзгеріс пайыздары
const translationChange = ref(0)
const voiceChange = ref(0)
const frequentChange = ref(0)
const todayChange = ref(0)

// Аударма деректері
const inputText = ref(localStorage.getItem('inputText') || 'Сәлем! Қалайсың? Мен бүгін университетке барамын...')
const translatedText = ref('Мәтін енгізіп, аударыңыз')
const showActions = ref(false)

// Жиі сөздер
const commonWords = ref(['Сәлем', 'Рахмет', 'Қалайсың?', 'Мен', 'Үйге', 'Барамын', 'Иә', 'Жоқ', 'Көмек', 'Рахмет'])

// Модальды терезе
const showResourcesModal = ref(false)

// ========== АНАЛИТИКА ФУНКЦИЯЛАРЫ ==========

// Серия күндерін есептеу
const calculateStreak = (history) => {
  if (history.length === 0) return 0
  
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
  return streak
}

// Өзгеріс пайызын есептеу
const calculateChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// Статистиканы жүктеу (НАҚТЫ ДЕРЕКТЕР)
const loadStats = () => {
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  
  totalTranslations.value = history.length
  
  const voiceHistory = JSON.parse(localStorage.getItem('voiceHistory') || '[]')
  voiceRequests.value = voiceHistory.length
  
  const dictionary = JSON.parse(localStorage.getItem('signDictionary') || '[]')
  frequentWordsCount.value = dictionary.length
  
  const today = new Date().toLocaleDateString()
  todayActivity.value = history.filter(item => item.date.includes(today)).length
  
  streakDays.value = calculateStreak(history)
  
  // Өзгеріс пайыздары (өткен аймен салыстыру)
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  
  const currentMonthHistory = history.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate >= lastMonth
  })
  
  const previousMonthHistory = history.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate < lastMonth
  })
  
  translationChange.value = calculateChange(currentMonthHistory.length, previousMonthHistory.length)
  
  const currentVoiceMonth = voiceHistory.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate >= lastMonth
  })
  const previousVoiceMonth = voiceHistory.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate < lastMonth
  })
  voiceChange.value = calculateChange(currentVoiceMonth.length, previousVoiceMonth.length)
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString()
  const yesterdayActivity = history.filter(item => item.date.includes(yesterdayStr)).length
  todayChange.value = calculateChange(todayActivity.value, yesterdayActivity)
}

// Сөз қосу
const addWord = (word) => {
  if (inputText.value.trim() === '') {
    inputText.value = word
  } else {
    inputText.value += ' ' + word
  }
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

  const words = normalized.split(' ').filter(Boolean)
  const results = []
  const seenIds = new Set()

  for (let i = 0; i < words.length; i++) {
    let matched = false
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

// Аудару
const translateText = async () => {
  if (!inputText.value.trim()) {
    translatedText.value = '❗ Мәтінді енгізіңіз...'
    showActions.value = false
    videoEntries.value = []
    return
  }
  
  const history = JSON.parse(localStorage.getItem('translationHistory') || '[]')
  history.unshift({
    text: inputText.value,
    translation: `🧏‍♂️ "${inputText.value}" - Қазақ ым тіліне аударылды`,
    date: new Date().toLocaleString()
  })
  localStorage.setItem('translationHistory', JSON.stringify(history.slice(0, 100)))
  
  videoEntries.value = findMatchingDictionaryEntries(inputText.value)
  await nextTick()
  document.querySelectorAll('.video-player').forEach((video) => {
    video.play().catch(() => {})
  })
  
  translatedText.value = ''
  showActions.value = true
  loadStats()
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
      const text = event.results[0][0].transcript
      inputText.value = text
      
      const voiceHistory = JSON.parse(localStorage.getItem('voiceHistory') || '[]')
      voiceHistory.unshift({
        text: text,
        date: new Date().toLocaleString()
      })
      localStorage.setItem('voiceHistory', JSON.stringify(voiceHistory.slice(0, 100)))
      loadStats()
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
  const text = inputText.value
  navigator.clipboard.writeText(text)
  alert(t('copied'))
}

// Нәтижені оқу
const speakResult = () => {
  const text = inputText.value
  const utterance = new SpeechSynthesisUtterance(text)
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

// Көбірек сөздер
const loadMoreWords = () => {
  const moreWords = ['Кешіріңіз', 'Түсінікті', 'Қайталаңыз', 'Жазыңыз', 'Оқыңыз']
  commonWords.value = [...commonWords.value, ...moreWords]
}

onMounted(async () => {
  await dictionaryStore.loadFromLocalStorage()
  loadStats()
  loadLanguage()
  translatePage()
  
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
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

  .video-card-title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    text-align: center;
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
  padding: 24px;
  min-height: 260px;
  background: #fafcff;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
}

.result-content {
  text-align: center;
  width: 100%;
}

.video-results {
  width: 100%;
}

.video-grid {
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

.video-card-title {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
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

/* ========== ҚАРАҢҒЫ РЕЖИМ ========== */
:root.dark-theme .home-container {
  background: #0f172a;
}

:root.dark-theme .welcome-section {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 28px;
}

:root.dark-theme .welcome-icon {
  background: rgba(99, 102, 241, 0.1);
  color: #8b5cf6;
}

:root.dark-theme .welcome-badge {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:root.dark-theme .welcome-left h1 {
  color: #f1f5f9;
}

:root.dark-theme .welcome-left p {
  color: #94a3b8;
}

:root.dark-theme .stat-card {
  background: #1e293b;
  border-color: #334155;
}

:root.dark-theme .stat-card .stat-info h3 {
  color: #f1f5f9;
}

:root.dark-theme .stat-card .stat-info p {
  color: #94a3b8;
}

:root.dark-theme .card {
  background: #1e293b;
  border-color: #334155;
}

:root.dark-theme .card-header {
  border-bottom-color: #334155;
}

:root.dark-theme .card-header h3 {
  color: #f1f5f9;
}

:root.dark-theme .header-left {
  color: #f1f5f9;
}

:root.dark-theme .badge {
  background: rgba(99, 102, 241, 0.1);
  color: #a78bfa;
}

:root.dark-theme textarea {
  background: #334155;
  color: #f1f5f9;
}

:root.dark-theme textarea::placeholder {
  color: #94a3b8;
}

:root.dark-theme textarea:focus {
  background: #3a3a4e;
}

:root.dark-theme .voice-row {
  background: #1e293b;
  border-top-color: #334155;
}

:root.dark-theme .voice-btn {
  background: #334155;
  color: #cbd5e1;
}

:root.dark-theme .voice-btn:hover {
  background: #475569;
  color: #a78bfa;
}

:root.dark-theme .hint {
  color: #94a3b8;
}

:root.dark-theme .result-box {
  background: #1e293b;
}

:root.dark-theme .result-text {
  color: #f1f5f9;
}

:root.dark-theme .action-btn {
  background: #334155;
  color: #cbd5e1;
}

:root.dark-theme .action-btn:hover {
  background: #475569;
}

:root.dark-theme .word-tag {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:root.dark-theme .word-tag:hover {
  background: #475569;
  color: #a78bfa;
}

:root.dark-theme .word-note {
  color: #94a3b8;
}

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
</style>