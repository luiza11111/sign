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
        <div v-if="mode === 'dactyl'" class="hand-pose-panel">
          <div class="pose-board">
            <div class="board-header">
              <div class="board-title">Dactyl</div>
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
                    <stop offset="0%" stop-color="#f9dfb9" />
                    <stop offset="100%" stop-color="#f3d0a1" />
                  </linearGradient>
                  <linearGradient id="fingerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f8dab2" />
                    <stop offset="100%" stop-color="#f2cfa0" />
                  </linearGradient>
                </defs>

                <g :transform="leftHandSvgTransform" class="hand-layer">
                  <path class="palm-shape" d="M44 142c0-20 18-36 40-36h80c22 0 40 16 40 36v40c0 20-18 36-40 36H84c-22 0-40-16-40-36v-40z" />
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
              <span class="handshape-subtitle">Қол пішіні</span>
            </div>
          </div>
        </div>
        <div v-else ref="animationContainer" class="animation-container"></div>
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
    const height = isThumb ? (state === 0 ? 84 : state === 1 ? 64 : 46) : (state === 0 ? 118 : state === 1 ? 80 : 54)
    const baseX = isThumb ? 26 : 78 + (index - 1) * 24
    const baseY = isThumb ? 156 : 26 + (118 - height)
    const rotate = isThumb ? (state === 2 ? -42 : state === 1 ? -30 : -18) : -8 + (index - 1) * 4
    const originX = baseX + 9
    const originY = baseY + height

    return {
      key: `finger-${index}`,
      x: baseX,
      y: baseY,
      width: isThumb ? 24 : 18,
      height,
      rx: 10,
      transform: `rotate(${rotate} ${originX} ${originY})`
    }
  })
})

const leftHandSvgTransform = computed(() => {
  return `translate(0 ${currentPose.value.left.y}) rotate(${currentPose.value.left.rot} 138 150)`
})

const rightHandSvgTransform = computed(() => {
  return `translate(520 0) scale(-1 1) translate(0 ${currentPose.value.right.y}) rotate(${-currentPose.value.right.rot} 138 150)`
})

const subtitle = computed(() => {
  return props.mode === 'dactyl'
    ? 'Әр әріптің нақты дактиль ымын көрсететін қол пішіндері.'
    : 'Lottie анимациясы мен бейне демонстрациясы бірге көрсетіледі.'
})

const fallbackFilePath = '/lottie/fallback.json'

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

  if (!animationContainer.value) return

  if (animation) {
    animation.destroy()
    animation = null
  }

  loadAnimationData(animationData)
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

.hand-pose-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 420px;
    gap: 20px;
  }

  .pose-board {
    width: 100%;
    max-width: 560px;
    background: linear-gradient(180deg, #eef4ff 0%, #ffffff 100%);
    border: 1px solid #dbeafe;
    border-radius: 34px;
    padding: 24px 24px 20px;
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

  .avatar-frame {
    position: relative;
    width: 174px;
    height: 156px;
    margin: 0 auto 10px;
  }

  .avatar-head {
    position: absolute;
    top: 0;
    left: 50%;
    width: 98px;
    height: 98px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: linear-gradient(180deg, #fde8c3 0%, #f7d9ad 100%);
    border: 4px solid #d8b38f;
    box-shadow: inset 0 14px 0 rgba(255, 255, 255, 0.75);
  }

  .avatar-neck {
    position: absolute;
    top: 92px;
    left: 50%;
    width: 42px;
    height: 30px;
    transform: translateX(-50%);
    background: #fde8c3;
    border-radius: 0 0 18px 18px;
  }

  .avatar-shoulders {
    position: absolute;
    top: 118px;
    left: 50%;
    width: 180px;
    height: 80px;
    transform: translateX(-50%);
    background: #eff4ff;
    border-radius: 80px 80px 30px 30px;
    box-shadow: inset 0 12px 0 rgba(255, 255, 255, 0.9);
  }

  .hand-scene {
    position: relative;
    width: 100%;
    min-height: 320px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 10px 16px 0;
  }

  .board-graphic {
    display: grid;
    grid-template-columns: 1.08fr 0.9fr;
    gap: 18px;
    width: 100%;
    align-items: start;
    margin-bottom: 18px;
  }

  .board-wall {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.08), transparent 28%),
      radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.08), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.95), #eef6ff);
    border-radius: 28px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
  }

  .board-graphic > * {
    position: relative;
    z-index: 1;
  }

  .board-person {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px 12px;
    min-height: 240px;
  }

  .person-head {
    width: 94px;
    height: 94px;
    border-radius: 50%;
    background: linear-gradient(180deg, #f9ddaf 0%, #f2c68b 100%);
    border: 4px solid #d7b484;
    box-shadow: inset 0 10px 0 rgba(255, 255, 255, 0.7);
  }

  .person-neck {
    width: 30px;
    height: 24px;
    border-radius: 0 0 14px 14px;
    background: #f9ddaf;
  }

  .person-body {
    width: 140px;
    height: 100px;
    border-radius: 28px 28px 30px 30px;
    background: linear-gradient(180deg, #9ec1df 0%, #6b8eb6 100%);
    box-shadow: inset 0 10px 0 rgba(255, 255, 255, 0.3);
  }

  .person-arm {
    width: 122px;
    height: 22px;
    border-radius: 999px;
    background: linear-gradient(180deg, #9ec1df 0%, #6b8eb6 100%);
    transform: translateX(12px) rotate(18deg);
  }

  .pinned-cards {
    display: grid;
    gap: 14px;
    padding: 18px 12px 12px;
  }

  .pinned-card {
    position: relative;
    width: 100%;
    height: 80px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dbe7ff;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  }

  .pin-dot {
    position: absolute;
    top: 12px;
    left: 50%;
    width: 12px;
    height: 12px;
    background: #c7d2fe;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
  }

  .card-illustration {
    position: absolute;
    top: 28px;
    left: 50%;
    width: 46px;
    height: 46px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, #eef6ff 0%, #dbeafe 100%);
    border-radius: 14px;
    border: 1px solid #cbd5e1;
  }

  .hand-stage {
    width: 100%;
    min-height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 14px 0;
  }

  .hand-stage .hand-graphic {
    max-width: 100%;
    height: 220px;
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

  .palm-shape {
    fill: url(#palmGradient);
    stroke: #cda16a;
    stroke-width: 3;
  }

  .finger-shape {
    fill: url(#fingerGradient);
    stroke: #cda16a;
    stroke-width: 2;
    filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.08));
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
    font-size: 72px;
    font-weight: 900;
    color: #102a43;
    line-height: 1;
  }

  .handshape-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .handshape-name {
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
  }

  .handshape-subtitle {
    color: #475569;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .animation-caption {
    font-size: 13px;
    color: #475569;
    max-width: 520px;
    text-align: center;
    margin: 0 auto;
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
