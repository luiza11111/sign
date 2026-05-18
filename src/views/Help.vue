<template>
  <div class="help-container">
    <!-- Бет басы -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <HelpCircle :size="32" :stroke-width="1.5" />
        </div>
        <div>
          <h1 data-i18n="help_title">Көмек</h1>
          <p data-i18n="help_subtitle">Жиі қойылатын сұрақтар және көмек</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <MessageCircle :size="16" />
          <span>{{ faqs.length }} <span data-i18n="faq">FAQ</span></span>
        </div>
        <div class="stat-badge">
          <Video :size="16" />
          <span>3 <span data-i18n="videos">бейне</span></span>
        </div>
      </div>
    </div>

    <!-- Статистика карточкалары -->
    <div class="stats-row">
      <div class="stat-mini-card">
        <div class="stat-mini-icon purple">
          <MessageSquare :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">{{ faqs.length }}</div>
          <div class="stat-mini-label" data-i18n="faq">Жиі сұрақтар</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon blue">
          <Film :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">3</div>
          <div class="stat-mini-label" data-i18n="videos">Нұсқаулық бейне</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon green">
          <Phone :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">24/7</div>
          <div class="stat-mini-label" data-i18n="support">Қолдау қызметі</div>
        </div>
      </div>
      <div class="stat-mini-card">
        <div class="stat-mini-icon orange">
          <Star :size="24" />
        </div>
        <div class="stat-mini-info">
          <div class="stat-mini-value">98%</div>
          <div class="stat-mini-label" data-i18n="satisfaction">Қанағаттану</div>
        </div>
      </div>
    </div>

    <!-- Жиі қойылатын сұрақтар -->
    <div class="faq-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <List :size="20" />
            <h3 data-i18n="faq">Жиі қойылатын сұрақтар</h3>
          </div>
          <div class="header-filters">
            <button 
              class="filter-chip" 
              :class="{ active: activeFilter === 'all' }"
              @click="activeFilter = 'all'"
            >
              <span data-i18n="all">Барлығы</span>
            </button>
            <button 
              class="filter-chip" 
              :class="{ active: activeFilter === 'popular' }"
              @click="activeFilter = 'popular'"
            >
              <span data-i18n="popular">Танымал</span>
            </button>
          </div>
        </div>

        <div class="faq-list">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="faq-item"
            :class="{ open: faq.open }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <div class="question-left">
                <Bookmark :size="16" class="question-icon" />
                <h4>{{ faq.question }}</h4>
              </div>
              <ChevronUp :size="16" class="question-arrow" v-if="faq.open" />
              <ChevronDown :size="16" class="question-arrow" v-else />
            </div>
            <div v-if="faq.open" class="faq-answer">
              <div class="answer-content">
                <Lightbulb :size="18" class="answer-icon" />
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Нұсқаулық бейнелер -->
    <div class="video-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <Film :size="20" />
            <h3 data-i18n="videos">Нұсқаулық бейнелер</h3>
          </div>
          <button class="more-btn" @click="showAllVideos">
            <span data-i18n="all">Барлығы</span>
            <ArrowRight :size="14" />
          </button>
        </div>

        <div class="video-grid">
          <div class="video-item" @click="playVideo(1)">
            <div class="video-thumbnail">
              <Play :size="20" class="play-icon" />
              <Film :size="28" class="video-emoji" />
            </div>
            <div class="video-info">
              <h4 data-i18n="video_1_title">Қалай аударма жасауға болады?</h4>
              <div class="video-meta">
                <Clock :size="12" />
                <span>2:35 <span data-i18n="minutes">минут</span></span>
                <Eye :size="12" />
                <span>1.2к <span data-i18n="views">көрілім</span></span>
              </div>
            </div>
          </div>
          <div class="video-item" @click="playVideo(2)">
            <div class="video-thumbnail">
              <Play :size="20" class="play-icon" />
              <Mic :size="28" class="video-emoji" />
            </div>
            <div class="video-info">
              <h4 data-i18n="video_2_title">Дауыстық енгізу қалай жұмыс істейді?</h4>
              <div class="video-meta">
                <Clock :size="12" />
                <span>1:48 <span data-i18n="minutes">минут</span></span>
                <Eye :size="12" />
                <span>856 <span data-i18n="views">көрілім</span></span>
              </div>
            </div>
          </div>
          <div class="video-item" @click="playVideo(3)">
            <div class="video-thumbnail">
              <Play :size="20" class="play-icon" />
              <BookOpen :size="28" class="video-emoji" />
            </div>
            <div class="video-info">
              <h4 data-i18n="video_3_title">Жиі сөздерді қалай қосуға болады?</h4>
              <div class="video-meta">
                <Clock :size="12" />
                <span>3:12 <span data-i18n="minutes">минут</span></span>
                <Eye :size="12" />
                <span>654 <span data-i18n="views">көрілім</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== БАЙЛАНЫС БӨЛІМІ (СІЛТЕМЕЛЕР ҚОСЫЛҒАН) ========== -->
    <div class="contact-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="header-left">
            <Phone :size="20" />
            <h3 data-i18n="contact">Бізбен байланысыңыз</h3>
          </div>
          <div class="contact-badge">
            <Circle :size="10" fill="#10b981" stroke="none" />
            <span data-i18n="online">Онлайн</span>
          </div>
        </div>

        <div class="contact-grid">
          <div class="contact-info">
            <!-- Email - mailto сілтемесі -->
            <a :href="'mailto:' + contact.email" class="contact-item">
              <div class="contact-icon purple">
                <Mail :size="22" />
              </div>
              <div class="contact-details">
                <h4>Email</h4>
                <p>{{ contact.email }}</p>
                <small data-i18n="response_time">Жауап беру уақыты: 1-2 сағат</small>
              </div>
            </a>

            <!-- Телефон - tel сілтемесі -->
            <a :href="'tel:' + contact.phone" class="contact-item">
              <div class="contact-icon blue">
                <Phone :size="22" />
              </div>
              <div class="contact-details">
                <h4 data-i18n="phone">Телефон</h4>
                <p>{{ contact.phoneFormatted }}</p>
                <small data-i18n="working_hours">09:00 - 18:00, Дс-Жм</small>
              </div>
            </a>

            <!-- Telegram - t.me сілтемесі -->
            <a :href="telegramUrl" target="_blank" class="contact-item" rel="noopener noreferrer">
              <div class="contact-icon green">
                <MessageCircle :size="22" />
              </div>
              <div class="contact-details">
                <h4>Telegram</h4>
                <p>{{ telegramUsername }}</p>
                <small data-i18n="support_24_7">24/7 онлайн</small>
              </div>
            </a>

            <!-- Мекенжай - Google Maps сілтемесі -->
            <a :href="contact.mapUrl" target="_blank" class="contact-item" rel="noopener noreferrer">
              <div class="contact-icon orange">
                <MapPin :size="22" />
              </div>
              <div class="contact-details">
                <h4 data-i18n="address">Мекенжай</h4>
                <p>{{ contact.address }}</p>
                <small data-i18n="appointment_required">Келу арқылы алдын ала жазылу</small>
              </div>
            </a>
          </div>

          <!-- Форма -->
          <form @submit.prevent="sendMessage" class="contact-form">
            <div class="form-group">
              <label data-i18n="your_name">Ваше имя</label>
              <div class="input-icon">
                <User :size="16" class="icon" />
                <input v-model="form.name" type="text" :placeholder="t('your_name')" required />
              </div>
            </div>

            <div class="form-group">
              <label data-i18n="your_email">Email для ответа</label>
              <div class="input-icon">
                <Mail :size="16" class="icon" />
                <input v-model="form.email" type="email" placeholder="example@mail.ru" required />
              </div>
            </div>

            <div class="form-group">
              <label data-i18n="subject">Тема обращения</label>
              <div class="input-icon">
                <Tag :size="16" class="icon" />
                <input v-model="form.subject" type="text" :placeholder="t('subject') + ' - Проблема с аккаунтом'" required />
              </div>
            </div>

            <div class="form-group">
              <label data-i18n="message">Подробное описание</label>
              <div class="input-icon textarea-icon">
                <FileText :size="16" class="icon" />
                <textarea v-model="form.message" rows="4" :placeholder="t('message')" required></textarea>
              </div>
            </div>

            <button type="submit" :disabled="loading" class="submit-btn">
              <Send v-if="!loading" :size="16" />
              <Loader2 v-else class="spinner-icon" :size="16" />
              <span data-i18n="send">{{ loading ? 'Жіберілуде...' : 'Жіберу' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Кеңес -->
    <div class="tip-card">
      <div class="tip-icon">
        <Lightbulb :size="20" />
      </div>
      <div class="tip-content">
        <strong data-i18n="tip_help_title">Кеңес:</strong>
        <span data-i18n="tip_help_text">Сұрағыңызға жауап таба алмасаңыз, бізге хабарласыңыз. Біз 24/7 онлайн режимінде көмектесуге дайынбыз!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, loadLanguage, translatePage } from '../i18n'

// Lucide иконкаларын импорттау
import { 
  HelpCircle, MessageCircle, Video, MessageSquare, Film, Phone, Star,
  List, Bookmark, ChevronUp, ChevronDown, Lightbulb, ArrowRight,
  Play, Clock, Eye, BookOpen, Circle, Mail, MapPin, User, Tag,
  FileText, Send, Loader2
} from 'lucide-vue-next'

// ========== БАЙЛАНЫС ДЕРЕКТЕРІ ==========
const contact = {
  email: 'adilkhanassel507@gmail.com',
  phone: '+77001234567',
  phoneFormatted: '+7 (700) 123-45-67',
  address: 'Алматы, Достык даңғылы 123',
  mapUrl: 'https://maps.google.com/?q=Алматы,Достык+даңғылы+123'
}

// ========== TELEGRAM ДЕРЕКТЕРІ ==========
const telegramUsername = '@QazaqSignBot'
const telegramUrl = 'https://t.me/QazaqSignBot'

// Жиі қойылатын сұрақтар
const faqs = ref([
  {
    question: 'Қалай аударма жасауға болады?',
    answer: 'Мәтінді жоғарғы өріске енгізіп, "Аудару" батырмасын басыңыз. Немесе дауыстық енгізуді қолдануға болады.',
    open: false,
    popular: true
  },
  {
    question: 'Дауыстық енгізу қалай жұмыс істейді?',
    answer: 'Микрофон батырмасын басып, сөйлеңіз. Браузеріңіз дауысты танып, мәтінге айналдырады.',
    open: false,
    popular: true
  },
  {
    question: 'Қандай тілдер қолдау көрсетеді?',
    answer: 'Қазіргі уақытта тек қазақ тілінен ым тіліне аудару қолдау көрсетеді.',
    open: false,
    popular: false
  },
  {
    question: 'Аударма тарихы қайда сақталады?',
    answer: 'Барлық аудармалар "Тарих" бетінде сақталады. Оларды кез келген уақытта көре аласыз.',
    open: false,
    popular: true
  },
  {
    question: 'Жиі сөздерді қалай қосуға болады?',
    answer: '"Жиі сөздер" бетіне өтіп, төменгі форма арқылы жаңа сөздер қоса аласыз.',
    open: false,
    popular: false
  },
  {
    question: 'Профильді қалай өңдеуге болады?',
    answer: '"Профиль" бетіне өтіп, "Өңдеу" батырмасын басыңыз. Атыңыз бен email-іңізді өзгерте аласыз.',
    open: false,
    popular: false
  },
  {
    question: 'Telegram ботыңыз бар ма?',
    answer: 'Иә! Біздің Telegram ботымыз @QazaqSignBot. Ол арқылы сұрақтарыңызды қойып, AI көмекшіден жауап ала аласыз! 🤖',
    open: false,
    popular: true
  }
])

const activeFilter = ref('all')
const loading = ref(false)

// Форма деректері
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Фильтрленген сұрақтар
const filteredFaqs = computed(() => {
  if (activeFilter.value === 'popular') {
    return faqs.value.filter(f => f.popular)
  }
  return faqs.value
})

// Сұрақты ашу/жабу
const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}

// Бейнені ойнату
const playVideo = (id) => {
  alert(t('video_coming_soon') + ` ${id}`)
}

// Барлық бейнелер
const showAllVideos = () => {
  alert(t('videos_coming_soon'))
}

// Хабарлама жіберу
const sendMessage = async () => {
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    alert(t('error_fill_fields'))
    return
  }
  
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert(t('message_sent'))
  form.value = { name: '', email: '', subject: '', message: '' }
  loading.value = false
}

onMounted(() => {
  loadLanguage()
  translatePage()
  
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
})
</script>

<style scoped>
.help-container {
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
  transition: all 0.3s ease;
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

/* ========== КАРТОЧКАЛАР ========== */
.faq-card, .video-card, .contact-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.faq-card:hover, .video-card:hover, .contact-card:hover {
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

.more-btn, .contact-badge {
  background: #f1f5f9;
  border: none;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.more-btn:hover {
  background: #e2e8f0;
  color: #6366f1;
}

.contact-badge {
  background: #dcfce7;
  color: #16a34a;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ========== FAQ ========== */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #f8fafc;
  border-radius: 20px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  transition: all 0.2s;
}

.faq-item.open {
  background: white;
  border-color: #e2e8f0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.faq-question:hover {
  background: #f1f5f9;
}

.question-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.question-icon {
  color: #6366f1;
}

.faq-question h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.question-arrow {
  color: #94a3b8;
}

.faq-answer {
  padding: 0 20px 20px 20px;
  border-top: 1px solid #f0f2f5;
}

.answer-content {
  display: flex;
  gap: 12px;
  padding-top: 16px;
}

.answer-icon {
  color: #f59e0b;
}

.answer-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  flex: 1;
  margin: 0;
}

/* ========== ВИДЕО ========== */
.video-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #eef2f6;
}

.video-item:hover {
  background: white;
  border-color: #e2e8f0;
  transform: translateX(4px);
}

.video-thumbnail {
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.play-icon {
  position: absolute;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  padding: 4px;
}

.video-thumbnail:hover .play-icon {
  opacity: 1;
}

.video-emoji {
  color: #6366f1;
}

.video-info {
  flex: 1;
}

.video-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #94a3b8;
}

/* ========== БАЙЛАНЫС (СІЛТЕМЕЛЕР ҚОСЫЛҒАН) ========== */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 28px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  text-decoration: none;
  padding: 12px;
  border-radius: 20px;
  transition: all 0.2s;
  cursor: pointer;
}

.contact-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.contact-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: white;
  transition: transform 0.2s;
}

.contact-item:hover .contact-icon {
  transform: scale(1.05);
}

.contact-icon.purple { background: #8b5cf6; }
.contact-icon.blue { background: #3b82f6; }
.contact-icon.green { background: #10b981; }
.contact-icon.orange { background: #f59e0b; }

.contact-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.contact-details p {
  font-size: 13px;
  color: #64748b;
}

.contact-details small {
  font-size: 10px;
  color: #94a3b8;
}

/* ========== ФОРМА ========== */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
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
.input-icon textarea {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.input-icon.textarea-icon {
  align-items: flex-start;
}

.input-icon.textarea-icon .icon {
  top: 14px;
}

.input-icon textarea {
  resize: vertical;
}

.input-icon input:focus,
.input-icon textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon input:focus + .icon,
.input-icon textarea:focus + .icon {
  color: #6366f1;
}

.submit-btn {
  margin-top: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

/* ========== ҚАРАҢҒЫ РЕЖИМ ========== */
:root.dark-theme .help-container {
  background: #0f172a;
}

:root.dark-theme .stat-badge,
:root.dark-theme .stat-mini-card,
:root.dark-theme .faq-card,
:root.dark-theme .video-card,
:root.dark-theme .contact-card {
  background: #1e293b !important;
  border-color: #334155 !important;
}

:root.dark-theme .header-content h1,
:root.dark-theme .stat-mini-value,
:root.dark-theme .card-header h3,
:root.dark-theme .contact-details h4,
:root.dark-theme .contact-details p {
  color: #f1f5f9 !important;
}

:root.dark-theme .header-content p,
:root.dark-theme .stat-mini-label,
:root.dark-theme .contact-details small {
  color: #94a3b8 !important;
}

:root.dark-theme .contact-item:hover {
  background: #334155 !important;
}

:root.dark-theme .form-group label {
  color: #cbd5e1 !important;
}

:root.dark-theme .input-icon input,
:root.dark-theme .input-icon textarea {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f1f5f9 !important;
}

:root.dark-theme .submit-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
}

:root.dark-theme .tip-card {
  background: #334155 !important;
}

:root.dark-theme .tip-content {
  color: #cbd5e1 !important;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
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
  
  .video-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .video-thumbnail {
    width: 100%;
    height: 100px;
  }
  
  .question-left {
    flex: 1;
  }
  
  .contact-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>