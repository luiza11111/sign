<template>
  <div class="animation-demo-card">
    <div class="animation-demo-header">
      <div>
        <h3>{{ mode === 'dactyl' ? 'Dactyl режимі' : 'Lottie және видео анимациясы' }}</h3>
        <p>{{ subtitle }}</p>
      </div>
      <div class="animation-actions">
        <button class="action-btn" @click="reloadAnimation">
          <RefreshCw :size="16" />
          Қайта жүктеу
        </button>
        <button class="action-btn primary" @click="playAnimation">
          <Play :size="16" />
          Ойнату
        </button>
      </div>
    </div>

    <div class="animation-body">
      <div class="lottie-panel">
        <div ref="animationContainer" class="animation-container"></div>
        <div v-if="mode === 'dactyl'" class="letter-overlay">
          <span>{{ currentLetter || ' ' }}</span>
          <div class="letter-note">Қазіргі поза</div>
        </div>
        <div class="animation-caption">
          {{ mode === 'dactyl' ? 'Персонаж ым тілін имитациялайтын позаларды көрсетеді.' : 'Lottie анимациясы мен бейне бірге көрсетіледі.' }}
        </div>
      </div>

      <div class="demo-info">
        <div class="demo-section" v-if="mode === 'dactyl'">
          <div class="demo-label">Қолданылатын мәтін:</div>
          <div class="letter-grid" v-if="letters.length">
            <span 
              class="letter-chip" 
              :class="{ active: index === currentLetterIndex.value }"
              v-for="(letter, index) in letters" 
              :key="index"
            >{{ letter }}</span>
          </div>
          <div class="empty-notice" v-else>Мәтінді енгізіңіз немесе аударма жасаңыз.</div>
        </div>

        <div class="demo-section" v-else>
          <div class="demo-label">Видео көрсеткіш</div>
          <div class="video-preview" v-if="videoUrl">
            <video controls muted autoplay loop playsinline :src="videoUrl"></video>
          </div>
          <div class="empty-notice" v-else>
            Видео табылмады. Алдымен аударма жасап, видеоларды іздеңіз.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import { Play, RefreshCw } from 'lucide-vue-next'

const props = defineProps({
  mode: { type: String, default: 'video' },
  text: { type: String, default: '' },
  videoUrl: { type: String, default: '' }
})

const animationContainer = ref(null)
let animation = null
let letterTimer = null
const currentLetterIndex = ref(0)

const letters = computed(() => {
  if (!props.text) return []
  return props.text
    .toUpperCase()
    .replace(/[^A-ZА-ЯӘҒҚҢӨҰҮҺІЁ\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split('')
    .filter((char) => char !== '')
})

const currentLetter = computed(() => {
  return letters.value[currentLetterIndex.value] || ''
})

const subtitle = computed(() => {
  return props.mode === 'dactyl'
    ? 'Персонажтың ым тілін имитациялайтын позалардың көрсетілімі.'
    : 'Lottie анимациясы мен бейне демонстрациясы бірге көрсетіледі.'
})

const fallbackPath = '/lottie/fallback.json'

const animationData = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: 'simple-demo',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], h: 1 },
            { t: 15, s: [100, 100, 100], h: 1 },
            { t: 30, s: [120, 120, 100], h: 1 },
            { t: 45, s: [100, 100, 100], h: 1 },
            { t: 60, s: [0, 0, 100], h: 1 }
          ]
        }
      },
      shapes: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [200, 200] }, nm: 'Ellipse Path 1' },
        { ty: 'fl', c: { a: 0, k: [0.15, 0.55, 0.95, 1] }, o: { a: 0, k: 100 }, nm: 'Fill 1' }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
}

const loadAnimationData = (data) => {
  if (!animationContainer.value) return

  if (animation) {
    animation.destroy()
    animation = null
  }

  animation = lottie.loadAnimation({
    container: animationContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: data
  })
}

const loadAnimationJson = async (path) => {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Unable to fetch ${path}`)
  }
  return response.json()
}

const loadLetterAnimation = async (letter) => {
  const encodedLetter = encodeURIComponent(letter)
  const filePath = `/lottie/${encodedLetter}.json`

  try {
    const jsonData = await loadAnimationJson(filePath)
    loadAnimationData(jsonData)
  } catch (err) {
    try {
      const fallbackData = await loadAnimationJson(fallbackPath)
      loadAnimationData(fallbackData)
    } catch (fallbackErr) {
      loadAnimationData(animationData)
    }
  }
}

const initAnimation = async () => {
  if (!animationContainer.value) return

  if (animation) {
    animation.destroy()
    animation = null
  }

  if (props.mode === 'dactyl' && currentLetter.value) {
    await loadLetterAnimation(currentLetter.value)
  } else {
    loadAnimationData(animationData)
  }
}

const startLetterSequence = () => {
  if (letterTimer) clearInterval(letterTimer)
  currentLetterIndex.value = 0

  if (letters.value.length === 0) return

  letterTimer = setInterval(async () => {
    currentLetterIndex.value = (currentLetterIndex.value + 1) % letters.value.length
    await loadLetterAnimation(currentLetter.value)
  }, 1200)
}

const stopLetterSequence = () => {
  if (letterTimer) {
    clearInterval(letterTimer)
    letterTimer = null
  }
}

const playAnimation = () => {
  if (animation) {
    animation.goToAndPlay(0, true)
  } else {
    initAnimation()
  }
}

const reloadAnimation = () => {
  initAnimation()
}

watch(() => props.mode, async () => {
  await initAnimation()

  if (props.mode === 'dactyl') {
    startLetterSequence()
  } else {
    stopLetterSequence()
  }
})

watch(() => props.text, async () => {
  if (props.mode === 'dactyl') {
    currentLetterIndex.value = 0
    startLetterSequence()
    await initAnimation()
  }
})

onMounted(async () => {
  await initAnimation()
  if (props.mode === 'dactyl') {
    startLetterSequence()
  }
})

onBeforeUnmount(() => {
  if (animation) animation.destroy()
  stopLetterSequence()
})
</script>

<style scoped>
.animation-demo-card {
  background: white;
  border-radius: 28px;
  border: 1px solid #eef2f6;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.animation-demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.animation-demo-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.animation-demo-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.animation-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #6366f1;
  border-color: transparent;
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
}

.animation-body {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 18px;
}

.lottie-panel {
  position: relative;
  border-radius: 24px;
  background: #f8fafc;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 320px;
}

.animation-container {
  flex: 1;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation-caption {
  font-size: 13px;
  color: #475569;
}

.letter-overlay {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
}

.letter-overlay span {
  font-size: 68px;
  font-weight: 800;
  color: #0f172a;
  text-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}

.letter-note {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.animation-container {
  flex: 1;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.letter-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.letter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  font-weight: 700;
  border: 1px solid #e2e8f0;
}

.letter-chip.active {
  background: #6366f1;
  color: #ffffff;
  border-color: #4f46e5;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-section {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #eef2f6;
  padding: 18px;
  min-height: 160px;
}

.demo-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #1e293b;
}

.letter-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.letter-chip {
  padding: 10px 12px;
  border-radius: 16px;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
  border: 1px solid #dbeafe;
}

.video-preview video {
  width: 100%;
  border-radius: 18px;
  max-height: 240px;
}

.empty-notice {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 960px) {
  .animation-body {
    grid-template-columns: 1fr;
  }
}
</style>
