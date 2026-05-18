<template>
  <div class="language-switcher">
    <button 
      v-for="lang in languages" 
      :key="lang.code"
      class="lang-btn"
      :class="{ active: currentLang === lang.code }"
      @click="changeLanguage(lang.code)"
    >
      <span class="lang-flag">{{ lang.flag }}</span>
      <span class="lang-name">{{ lang.name }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { languages, setLanguage, currentLanguage, loadLanguage, translatePage } from '../i18n'

const currentLang = ref('kk')

const langList = [
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]

const changeLanguage = (lang) => {
  setLanguage(lang)
  currentLang.value = lang
  translatePage()
  // Бетті қайта жүктемеу үшін
  window.location.reload()
}

onMounted(() => {
  loadLanguage()
  currentLang.value = currentLanguage.value
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 40px;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
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

.lang-flag {
  font-size: 16px;
}

.lang-name {
  font-size: 13px;
}

/* Қараңғы режим */
.dark-theme .language-switcher {
  background: #334155;
}

.dark-theme .lang-btn {
  color: #cbd5e1;
}

.dark-theme .lang-btn:hover {
  background: #475569;
}
</style>