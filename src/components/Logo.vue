<template>
  <div class="logo" :class="[size, variant]">
    <!-- Иконка (тек monogram, hand, wave нұсқаларында) -->
    <div v-if="variant === 'monogram'" class="logo-icon monogram">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#gradient)"/>
        <text x="20" y="27" text-anchor="middle" fill="white" font-size="18" font-weight="700" font-family="Arial">S</text>
        <text x="28" y="27" text-anchor="middle" fill="white" font-size="14" font-weight="600" font-family="Arial">F</text>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div v-if="variant === 'hand'" class="logo-icon hand">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.6868 2 9.5 2.5 8.5 3.5C7.5 4.5 7 5.6868 7 7V11C7 12.5 7.5 13.5 8.5 14.5" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 2C13.3132 2 14.5 2.5 15.5 3.5C16.5 4.5 17 5.6868 17 7V11C17 12.5 16.5 13.5 15.5 14.5" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M9 16L8 18C7.5 19 7 20 7 21" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M15 16L16 18C16.5 19 17 20 17 21" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="12" cy="7" r="2" fill="url(#grad)"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div v-if="variant === 'wave'" class="logo-icon wave">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 15C5 15 5 12 7 12C9 12 9 15 11 15C13 15 13 12 15 12C17 12 17 15 19 15C21 15 21 12 23 12" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M3 9C5 9 5 12 7 12C9 12 9 9 11 9C13 9 13 12 15 12C17 12 17 9 19 9C21 9 21 12 23 12" stroke="url(#grad)" stroke-width="1.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Текст бөлігі -->
    <div class="logo-text">
      <span class="logo-name">{{ name }}</span>
      <span v-if="showTagline" class="logo-tagline">{{ tagline }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'monogram', // monogram, hand, wave, text
    validator: (value) => ['monogram', 'hand', 'wave', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  name: {
    type: String,
    default: 'SignFlow'
  },
  tagline: {
    type: String,
    default: 'Қазақ ым тілі • AI'
  },
  showTagline: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Текст стилі */
.logo-name {
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
}

.logo-tagline {
  display: block;
  color: #94a3b8;
  margin-top: 2px;
  font-size: 0.7rem;
}

/* Өлшемдер */
.logo.sm .logo-name {
  font-size: 18px;
}
.logo.sm .logo-tagline {
  font-size: 9px;
}
.logo.sm .logo-icon svg {
  width: 28px;
  height: 28px;
}

.logo.md .logo-name {
  font-size: 22px;
}
.logo.md .logo-tagline {
  font-size: 10px;
}
.logo.md .logo-icon svg {
  width: 36px;
  height: 36px;
}

.logo.lg .logo-name {
  font-size: 28px;
}
.logo.lg .logo-tagline {
  font-size: 11px;
}
.logo.lg .logo-icon svg {
  width: 48px;
  height: 48px;
}

/* Тек мәтін нұсқасы */
.logo.text-only .logo-text {
  text-align: center;
}
</style>