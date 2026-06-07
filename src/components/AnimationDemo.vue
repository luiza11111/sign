<template>
  <div class="animation-demo-card">
    <div class="animation-demo-header">
      <div>
        <h3>{{ cardTitle }}</h3>
        <p>{{ subtitle }}</p>
      </div>
      <div class="animation-actions">
        <button class="action-btn" @click="mode === 'dactyl' ? stopDactyl() : reloadAnimation()">
          <RefreshCw :size="16" />
          {{ reloadLabel }}
        </button>
        <button class="action-btn primary" @click="playAnimation">
          <Play :size="16" />
          {{ playLabel }}
        </button>
      </div>
    </div>

    <div class="animation-body">
      <div class="lottie-panel">
        <div v-if="mode === 'dactyl'" class="hand-pose-panel">
          <div class="pose-board">
            <div class="board-header">
              <div class="board-title">{{ dactylLabel }}</div>
              <div class="board-badges">
                <span class="badge-dot"></span>
                <span class="badge-dot"></span>
                <span class="badge-dot"></span>
              </div>
            </div>

            <div class="board-graphic">
              <div class="board-wall"></div>
              <div class="board-person">
                <div class="person-head"></div>
                <div class="person-neck"></div>
                <div class="person-body"></div>
                <div class="person-arm"></div>
              </div>
              <div class="pinned-cards">
                <div v-for="n in 3" :key="n" class="pinned-card">
                  <div class="pin-dot"></div>
                  <div class="card-illustration"></div>
                </div>
              </div>
            </div>

            <div class="hand-stage">
              <svg class="hand-graphic" viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="palmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f8e3b6" />
                    <stop offset="100%" stop-color="#e3c39a" />
                  </linearGradient>
                  <linearGradient id="fingerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f5d5a5" />
                    <stop offset="100%" stop-color="#d8b289" />
                  </linearGradient>
                  <radialGradient id="highlightGradient" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                  </radialGradient>
                  <filter id="fingerShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.12" />
                  </filter>
                </defs>

                <g :transform="leftHandSvgTransform" class="hand-layer">
                  <path class="wrist-shape" d="M24 214c0 16 42 32 98 32h80c56 0 98-16 98-32s-42-40-98-40h-80c-56 0-98 24-98 40z" />
                  <path class="palm-shape" d="M42 146c0-22 18-40 40-40h84c22 0 40 18 40 40v40c0 22-18 40-40 40H82c-22 0-40-18-40-40v-40z" />
                  <path class="palm-highlight" d="M62 156c0-14 10-24 24-24h84c14 0 24 10 24 24v20c0 14-10 24-24 24H86c-14 0-24-10-24-24v-20z" />
                  <g v-for="finger in svgFingers" :key="finger.key">
                    <rect
                      :x="finger.x"
                      :y="finger.y"
                      :width="finger.width"
                      :height="finger.height"
                      :rx="finger.rx"
                      :transform="finger.transform"
                      class="finger-shape"
                    />
                  </g>
                </g>
              </svg>
            </div>

            <div class="letter-strip" v-if="letters.length">
              <span
                v-for="(letter, index) in letters"
                :key="index"
                :class="['strip-chip', { active: index === currentLetterIndex.value }]"
              >{{ letter }}</span>
            </div>
          </div>

          <div class="pose-footer">
            <div class="pose-letter">{{ currentLetter || ' ' }}</div>
            <div class="handshape-label">
              <span class="handshape-name">{{ handShapeLabel }}</span>
              <span class="handshape-subtitle">{{ handshapeTitle }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <video
            v-if="props.videoUrl"
            ref="videoPlayer"
            class="animation-container video-player"
            :src="props.videoUrl"
            autoplay
            loop
            muted
            playsinline
            controls
          ></video>

          <div v-else ref="animationContainer" class="animation-container"></div>
        </div>
        <div class="animation-caption">
          {{ captionText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import { Play, RefreshCw } from 'lucide-vue-next'
import { t } from '../i18n'

const props = defineProps({
  mode: { type: String, default: 'video' },
  text: { type: String, default: '' },
  phrase: { type: String, default: '' },
  videoUrl: { type: String, default: '' }
})

const animationContainer = ref(null)
const videoPlayer = ref(null)
let animation = null
let letterTimer = null
const currentLetterIndex = ref(0)

const normalizeLottieFileName = (value) => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІі0-9\s]/g, '')
    .replace(/\s+/g, '_')
}

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

const dactylAlphabet = {
  A: { handshape: 'Fist', left: { rot: -12, y: 4, fingers: [2, 2, 2, 2, 2] }, right: { rot: 12, y: 8, fingers: [2, 2, 2, 2, 2] } },
  B: { handshape: 'Flat palm', left: { rot: -8, y: 2, fingers: [1, 0, 0, 0, 0] }, right: { rot: 14, y: 0, fingers: [1, 0, 0, 0, 0] } },
  C: { handshape: 'C-shape', left: { rot: -10, y: 4, fingers: [1, 1, 1, 1, 1] }, right: { rot: 10, y: -2, fingers: [1, 1, 1, 1, 1] } },
  D: { handshape: 'D-point', left: { rot: -8, y: 2, fingers: [2, 0, 2, 2, 2] }, right: { rot: 12, y: 0, fingers: [2, 0, 2, 2, 2] } },
  E: { handshape: 'Claw', left: { rot: -10, y: 0, fingers: [2, 2, 2, 2, 2] }, right: { rot: 10, y: 4, fingers: [2, 2, 2, 2, 2] } },
  F: { handshape: 'Pinch', left: { rot: -8, y: 3, fingers: [0, 1, 2, 2, 2] }, right: { rot: 10, y: 2, fingers: [0, 1, 2, 2, 2] } },
  G: { handshape: 'G-point', left: { rot: -9, y: 4, fingers: [0, 2, 2, 2, 2] }, right: { rot: 11, y: 1, fingers: [0, 2, 2, 2, 2] } },
  H: { handshape: 'Two fingers', left: { rot: -7, y: 2, fingers: [2, 0, 0, 2, 2] }, right: { rot: 13, y: 0, fingers: [2, 0, 0, 2, 2] } },
  I: { handshape: 'Pinkie out', left: { rot: -6, y: 5, fingers: [2, 2, 2, 2, 0] }, right: { rot: 10, y: 1, fingers: [2, 2, 2, 2, 0] } },
  J: { handshape: 'Pinkie trace', left: { rot: -6, y: 5, fingers: [2, 2, 2, 2, 0] }, right: { rot: 10, y: 1, fingers: [2, 2, 2, 2, 0] } },
  K: { handshape: 'V with thumb', left: { rot: -8, y: 3, fingers: [0, 0, 2, 2, 2] }, right: { rot: 12, y: 0, fingers: [0, 0, 2, 2, 2] } },
  L: { handshape: 'L-shape', left: { rot: -6, y: 4, fingers: [0, 2, 2, 2, 2] }, right: { rot: 16, y: 2, fingers: [0, 2, 2, 2, 2] } },
  M: { handshape: 'Three over thumb', left: { rot: -12, y: 6, fingers: [2, 2, 2, 2, 0] }, right: { rot: 8, y: -2, fingers: [2, 2, 2, 2, 0] } },
  N: { handshape: 'Two over thumb', left: { rot: -11, y: 5, fingers: [2, 2, 2, 2, 0] }, right: { rot: 9, y: -1, fingers: [2, 2, 2, 2, 0] } },
  O: { handshape: 'O-shape', left: { rot: -10, y: 3, fingers: [1, 1, 1, 1, 1] }, right: { rot: 10, y: 2, fingers: [1, 1, 1, 1, 1] } },
  P: { handshape: 'Downward K', left: { rot: -9, y: 2, fingers: [0, 0, 2, 2, 2] }, right: { rot: 11, y: 0, fingers: [0, 0, 2, 2, 2] } },
  Q: { handshape: 'Downward G', left: { rot: -10, y: 3, fingers: [0, 2, 2, 2, 2] }, right: { rot: 10, y: 1, fingers: [0, 2, 2, 2, 2] } },
  R: { handshape: 'Crossed fingers', left: { rot: -8, y: 3, fingers: [2, 0, 0, 2, 2] }, right: { rot: 12, y: 1, fingers: [2, 0, 0, 2, 2] } },
  S: { handshape: 'Fist', left: { rot: -11, y: 2, fingers: [2, 2, 2, 2, 2] }, right: { rot: 9, y: 0, fingers: [2, 2, 2, 2, 2] } },
  T: { handshape: 'Thumb tuck', left: { rot: -10, y: 4, fingers: [2, 2, 2, 2, 0] }, right: { rot: 10, y: 1, fingers: [2, 2, 2, 2, 0] } },
  U: { handshape: 'U-shape', left: { rot: -9, y: 3, fingers: [2, 0, 0, 2, 2] }, right: { rot: 11, y: 0, fingers: [2, 0, 0, 2, 2] } },
  V: { handshape: 'V-shape', left: { rot: -8, y: 3, fingers: [2, 0, 0, 2, 2] }, right: { rot: 12, y: 1, fingers: [2, 0, 0, 2, 2] } },
  W: { handshape: 'W-shape', left: { rot: -7, y: 2, fingers: [2, 0, 0, 0, 2] }, right: { rot: 13, y: 0, fingers: [2, 0, 0, 0, 2] } },
  X: { handshape: 'Hook', left: { rot: -10, y: 4, fingers: [2, 1, 2, 2, 2] }, right: { rot: 10, y: 1, fingers: [2, 1, 2, 2, 2] } },
  Y: { handshape: 'Y-shape', left: { rot: -6, y: 5, fingers: [0, 2, 2, 2, 0] }, right: { rot: 12, y: 1, fingers: [0, 2, 2, 2, 0] } },
  Z: { handshape: 'Z-trace', left: { rot: -8, y: 3, fingers: [2, 0, 2, 2, 2] }, right: { rot: 12, y: 0, fingers: [2, 0, 2, 2, 2] } },
  Ә: { handshape: 'Ә-shape', left: { rot: -12, y: 5, fingers: [1, 1, 2, 2, 2] }, right: { rot: 10, y: 0, fingers: [1, 1, 2, 2, 2] } },
  Ғ: { handshape: 'Ғ-point', left: { rot: -9, y: 4, fingers: [0, 2, 2, 2, 2] }, right: { rot: 11, y: 0, fingers: [0, 2, 2, 2, 2] } },
  Қ: { handshape: 'Қ-pinch', left: { rot: -8, y: 3, fingers: [1, 0, 0, 2, 2] }, right: { rot: 12, y: 1, fingers: [1, 0, 0, 2, 2] } },
  Ң: { handshape: 'Ң-shape', left: { rot: -11, y: 4, fingers: [2, 2, 2, 2, 0] }, right: { rot: 9, y: 0, fingers: [2, 2, 2, 2, 0] } },
  Ө: { handshape: 'Ө-curve', left: { rot: -10, y: 4, fingers: [1, 1, 1, 1, 2] }, right: { rot: 12, y: -2, fingers: [1, 1, 1, 1, 2] } },
  Ұ: { handshape: 'Ұ-shape', left: { rot: -10, y: 3, fingers: [2, 2, 2, 2, 0] }, right: { rot: 14, y: 0, fingers: [2, 2, 2, 2, 0] } },
  Ү: { handshape: 'Ү-shape', left: { rot: -10, y: 5, fingers: [2, 0, 0, 2, 2] }, right: { rot: 10, y: 2, fingers: [2, 0, 0, 2, 2] } },
  Һ: { handshape: 'Һ-point', left: { rot: -8, y: 2, fingers: [2, 0, 0, 2, 2] }, right: { rot: 12, y: 1, fingers: [2, 0, 0, 2, 2] } },
  І: { handshape: 'І-point', left: { rot: -6, y: 5, fingers: [2, 2, 2, 2, 0] }, right: { rot: 10, y: 1, fingers: [2, 2, 2, 2, 0] } }
}

const defaultPose = {
  handshape: '–',
  left: { rot: -8, y: 0, fingers: [0, 0, 0, 0, 0] },
  right: { rot: 12, y: 0, fingers: [0, 0, 0, 0, 0] }
}

const currentPose = computed(() => {
  const letter = currentLetter.value
  if (!letter) return defaultPose

  return dactylAlphabet[letter] || dactylAlphabet[letter.toUpperCase()] || defaultPose
})

const handShapeLabel = computed(() => currentPose.value.handshape)

const leftHandStyle = computed(() => ({
  transform: `translateY(${currentPose.value.left.y}px) rotate(${currentPose.value.left.rot}deg)`
}))

const rightHandStyle = computed(() => ({
  transform: `translateY(${currentPose.value.right.y}px) rotate(${currentPose.value.right.rot}deg)`
}))

const leftFingers = computed(() => currentPose.value.left.fingers)
const rightFingers = computed(() => currentPose.value.right.fingers)

const svgFingers = computed(() => {
  return currentPose.value.left.fingers.map((state, index) => {
    const isThumb = index === 0
    const height = isThumb ? (state === 0 ? 72 : state === 1 ? 50 : 38) : (state === 0 ? 124 : state === 1 ? 84 : 60)
    const baseX = isThumb ? 34 : 86 + (index - 1) * 26
    const baseY = isThumb ? 148 : 28 + (124 - height)
    const rotate = isThumb ? (state === 2 ? -42 : state === 1 ? -30 : -18) : -10 + (index - 1) * 2
    const originX = baseX + (isThumb ? 18 : 9)
    const originY = baseY + height

    return {
      key: `finger-${index}`,
      x: baseX,
      y: baseY,
      width: isThumb ? 28 : 20,
      height,
      rx: 14,
      transform: `rotate(${rotate} ${originX} ${originY})`
    }
  })
})

const leftHandSvgTransform = computed(() => {
  return `translate(0 ${currentPose.value.left.y}) rotate(${currentPose.value.left.rot} 176 160)`
})

const rightHandSvgTransform = computed(() => {
  return `translate(520 0) scale(-1 1) translate(0 ${currentPose.value.right.y}) rotate(${-currentPose.value.right.rot} 138 150)`
})

const cardTitle = computed(() => {
  return props.mode === 'dactyl'
    ? t('dactyl_mode_card')
    : t('lottie_video_animation_card')
})

const subtitle = computed(() => {
  return props.mode === 'dactyl'
    ? t('dactyl_mode_description')
    : t('lottie_video_description')
})

const captionText = computed(() => {
  return props.mode === 'dactyl'
    ? t('dactyl_caption')
    : t('lottie_video_caption')
})

const reloadLabel = computed(() => t('reload'))
const playLabel = computed(() => t('play'))
const handshapeTitle = computed(() => t('handshape'))
const dactylLabel = computed(() => t('dactyl_label'))

const lottieBasePath = '/lottie'
const fallbackFilePath = `${lottieBasePath}/fallback.json`

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

const loadVideo = async () => {
  // stop any Lottie animation
  if (animation) {
    animation.destroy()
    animation = null
  }

  if (!videoPlayer.value) return

  try {
    // ensure src is up to date and play
    videoPlayer.value.src = props.videoUrl || ''
    // Safari/Chrome may require play() to be called programmatically
    await videoPlayer.value.play().catch(() => {})
  } catch (err) {
    // ignore play errors (autoplay policies)
  }
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
  const filePath = `${lottieBasePath}/${encodedLetter}.json`

  try {
    const jsonData = await loadAnimationJson(filePath)
    loadAnimationData(jsonData)
    return
  } catch (err) {
    // try fallback if specific letter JSON is missing
  }

  try {
    const fallbackData = await loadAnimationJson(fallbackFilePath)
    loadAnimationData(fallbackData)
  } catch (fallbackErr) {
    loadAnimationData(animationData)
  }
}

const loadPhraseAnimation = async (phrase) => {
  const trimmed = (phrase || '').trim()
  if (!trimmed) {
    loadAnimationData(animationData)
    return
  }

  const cleanedFileName = normalizeLottieFileName(trimmed)
  const filePath = `${lottieBasePath}/${encodeURIComponent(cleanedFileName)}.json`

  try {
    const jsonData = await loadAnimationJson(filePath)
    loadAnimationData(jsonData)
    return
  } catch (err) {
    // fallback to first letter if phrase Lottie is not available
  }

  const firstLetter = letters.value[0]
  if (firstLetter) {
    await loadLetterAnimation(firstLetter)
  } else {
    try {
      const fallbackData = await loadAnimationJson(fallbackFilePath)
      loadAnimationData(fallbackData)
    } catch (fallbackErr) {
      loadAnimationData(animationData)
    }
  }
}

const initAnimation = async () => {
  if (props.mode === 'dactyl') {
    return
  }

  // If video URL provided, prefer video playback
  if (props.videoUrl) {
    await loadVideo()
    return
  }

  // Otherwise use Lottie
  if (!animationContainer.value) return

  if (animation) {
    animation.destroy()
    animation = null
  }

  if (props.phrase) {
    await loadPhraseAnimation(props.phrase)
  } else {
    const firstLetter = letters.value[0]
    if (firstLetter) {
      await loadLetterAnimation(firstLetter)
    } else {
      loadAnimationData(animationData)
    }
  }
}

const startLetterSequence = () => {
  if (letterTimer) clearInterval(letterTimer)
  currentLetterIndex.value = 0

  if (letters.value.length === 0) return

  letterTimer = setInterval(() => {
    currentLetterIndex.value = (currentLetterIndex.value + 1) % letters.value.length
  }, 1200)
}

const stopLetterSequence = () => {
  if (letterTimer) {
    clearInterval(letterTimer)
    letterTimer = null
  }
}

const playAnimation = () => {
  if (props.mode === 'dactyl') {
    startLetterSequence()
    return
  }

  if (animation) {
    animation.goToAndPlay(0, true)
  } else {
    initAnimation()
  }
}

const reloadAnimation = () => {
  if (props.mode === 'dactyl') {
    currentLetterIndex.value = 0
    startLetterSequence()
    return
  }

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
  } else {
    await initAnimation()
  }
})

watch(() => props.phrase, async () => {
  if (props.mode !== 'dactyl') {
    await initAnimation()
  }
})

watch(() => props.videoUrl, async () => {
  if (props.mode !== 'dactyl') {
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
  if (videoPlayer.value) {
    try {
      videoPlayer.value.pause()
      videoPlayer.value.src = ''
    } catch (e) {}
  }
})
</script>

<style scoped>
.animation-demo-card {
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.animation-demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.animation-demo-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.animation-demo-header p {
  margin: 6px 0 0;
  color: var(--text-secondary);
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
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn.primary {
  background: #6366f1;
  border-color: transparent;
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.14);
}

.animation-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.lottie-panel {
  position: relative;
  border-radius: 20px;
  background: var(--bg-secondary);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 260px;
  max-height: 380px;
}

.animation-container {
  flex: 1;
  min-height: 160px;
  max-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: auto;
  max-height: 240px;
  background: black;
  border-radius: 12px;
}

.animation-caption {
  font-size: 12px;
  color: var(--text-secondary);
  max-width: 520px;
  text-align: center;
  margin: 0 auto;
}

.hand-pose-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 320px;
  gap: 16px;
}

.pose-board {
  width: 100%;
  max-width: 560px;
  background: linear-gradient(180deg, #eef4ff 0%, #ffffff 100%);
  border: 1px solid #dbeafe;
  border-radius: 32px;
  padding: 22px 22px 18px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
  position: relative;
  overflow: hidden;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.board-title {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.board-badges {
  display: flex;
  gap: 10px;
}

.badge-dot {
  width: 10px;
  height: 10px;
  background: #c7d2fe;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

.hand-stage {
  width: 100%;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px 0;
  background: radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.72), transparent 35%), linear-gradient(180deg, #eef7ff 0%, #dfe9ff 100%);
  border-radius: 24px;
}

.hand-stage .hand-graphic {
  max-width: 100%;
  width: 100%;
  height: 220px;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 20px 48px rgba(15, 23, 42, 0.08);
}

.hand-graphic {
  width: 100%;
  height: auto;
  overflow: visible;
}

.hand-layer {
  opacity: 1;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.wrist-shape {
  fill: #d7b08a;
  opacity: 0.92;
}

.palm-shape {
  fill: url(#palmGradient);
  stroke: #c29866;
  stroke-width: 3;
  filter: url(#fingerShadow);
}

.palm-highlight {
  fill: url(#highlightGradient);
  opacity: 0.85;
}

.finger-shape {
  fill: url(#fingerGradient);
  stroke: #c29866;
  stroke-width: 2;
  filter: url(#fingerShadow);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.letter-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 0 10px 10px;
}

.strip-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 14px;
  background: #f1f5ff;
  color: #1d4ed8;
  font-weight: 700;
  border: 1px solid transparent;
}

.strip-chip.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4338ca;
}

.pose-footer {
  display: grid;
  gap: 8px;
  align-items: center;
  justify-items: center;
}

.pose-letter {
  font-size: 62px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
}

.handshape-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.handshape-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.handshape-subtitle {
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 960px) {
  .animation-body {
    grid-template-columns: 1fr;
  }
}
</style>
