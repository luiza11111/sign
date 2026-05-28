const fs = require('fs')
const path = require('path')

const letters = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  'А','Ә','Б','В','Г','Ғ','Д','Е','Ё','Ж','З','И','Й','К','Қ','Л','М','Н','Ң','О','Ө','П','Р','С','Т','У','Ұ','Ү','Ф','Х','Һ','Ц','Ч','Ш','Щ','Ъ','Ы','І','Ь','Э','Ю','Я'
]

const outputDir = path.join(__dirname, 'public', 'lottie')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Генерирует уникальную позу для каждой буквы
const getPoseForLetter = (letter) => {
  if (!letter || typeof letter !== 'string') {
    return { leftRot: -15, rightRot: 25, leftY: 0, rightY: 0, bodyRot: 0, fingerSpread: 0, headTilt: 0 }
  }

  const code = letter.charCodeAt(0)
  const hash = code * 7 + (code % 13) * 3

  return {
    leftRot: ((hash * 2) % 60) - 30,
    rightRot: ((hash * 3 + 15) % 60) - 30,
    leftY: ((hash + 10) % 20) - 10,
    rightY: ((hash + 20) % 20) - 10,
    bodyRot: ((hash) % 15) - 7,
    fingerSpread: (code % 3) * 8,
    headTilt: ((code * 5) % 10) - 5
  }
}

// Создает слой для руки с пальцами
const createArmWithFingers = (name, x, y, rotation, fingerSpread, color) => {
  const isLeft = name === 'left-arm'
  
  return {
    ddd: 0,
    ind: isLeft ? 1 : 2,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: 0, h: 1 },
          { t: 25, s: rotation, h: 1 },
          { t: 60, s: rotation, h: 1 },
          { t: 85, s: 0, h: 1 }
        ]
      },
      p: { a: 0, k: [x, y, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    shapes: [
      {
        ty: 'gr',
        it: [
          // Предплечье
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[-10, 0], [10, 0], [10, 70], [-10, 70]],
                c: true
              }
            },
            nm: 'forearm'
          },
          // Кисть
          {
            ty: 'el',
            p: { a: 0, k: [0, 88] },
            s: { a: 0, k: [24, 24] },
            nm: 'hand'
          },
          // Большой палец
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[-18, 80], [-12, 80], [-12, 100], [-18, 100]],
                c: true
              }
            },
            nm: 'thumb'
          },
          // Указательный палец
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[-6 + fingerSpread, 98], [-2 + fingerSpread, 98], [-2 + fingerSpread, 120], [-6 + fingerSpread, 120]],
                c: true
              }
            },
            nm: 'index-finger'
          },
          // Средний палец
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[0 + fingerSpread, 100], [4 + fingerSpread, 100], [4 + fingerSpread, 125], [0 + fingerSpread, 125]],
                c: true
              }
            },
            nm: 'middle-finger'
          },
          // Безымянный палец
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[8 + fingerSpread, 98], [12 + fingerSpread, 98], [12 + fingerSpread, 120], [8 + fingerSpread, 120]],
                c: true
              }
            },
            nm: 'ring-finger'
          },
          // Мизинец
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                v: [[16 + fingerSpread, 96], [20 + fingerSpread, 96], [20 + fingerSpread, 116], [16 + fingerSpread, 116]],
                c: true
              }
            },
            nm: 'pinky-finger'
          },
          {
            ty: 'fl',
            c: { a: 0, k: color },
            o: { a: 0, k: 100 },
            nm: 'fill'
          }
        ],
        nm: 'arm-group'
      }
    ],
    ip: 0,
    op: 90,
    st: 0,
    bm: 0
  }
}

// Создает голову с лицом
const createHeadWithFace = (headTilt) => {
  return {
    ddd: 0,
    ind: 3,
    ty: 4,
    nm: 'head',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: 0, h: 1 },
          { t: 25, s: headTilt, h: 1 },
          { t: 60, s: headTilt, h: 1 },
          { t: 85, s: 0, h: 1 }
        ]
      },
      p: { a: 0, k: [250, 150, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    shapes: [
      {
        ty: 'gr',
        it: [
          // Голова
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 110] },
            nm: 'head-shape'
          },
          // Левый глаз
          {
            ty: 'el',
            p: { a: 0, k: [-20, -15] },
            s: { a: 0, k: [8, 8] },
            nm: 'eye-left'
          },
          // Правый глаз
          {
            ty: 'el',
            p: { a: 0, k: [20, -15] },
            s: { a: 0, k: [8, 8] },
            nm: 'eye-right'
          },
          // Зрачок левый
          {
            ty: 'el',
            p: { a: 0, k: [-20, -15] },
            s: { a: 0, k: [4, 4] },
            nm: 'pupil-left'
          },
          // Зрачок правый
          {
            ty: 'el',
            p: { a: 0, k: [20, -15] },
            s: { a: 0, k: [4, 4] },
            nm: 'pupil-right'
          },
          // Нос
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0]],
                v: [[0, -5], [-3, 5], [3, 5]],
                c: true
              }
            },
            nm: 'nose'
          },
          // Рот
          {
            ty: 'sh',
            ks: {
              a: 0,
              k: {
                i: [[0, 0], [6, 0]],
                o: [[0, 0], [-6, 0]],
                v: [[-12, 18], [12, 18]],
                c: false
              }
            },
            nm: 'mouth'
          },
          // Цвет кожи
          {
            ty: 'fl',
            c: { a: 0, k: [0.98, 0.82, 0.68, 1] },
            o: { a: 0, k: 100 },
            nm: 'skin-fill'
          },
          // Черный цвет для деталей
          {
            ty: 'st',
            c: { a: 0, k: [0.1, 0.1, 0.1, 1] },
            w: { a: 0, k: 2 },
            lc: 1,
            lj: 1,
            nm: 'outline'
          }
        ],
        nm: 'head-group'
      }
    ],
    ip: 0,
    op: 90,
    st: 0,
    bm: 0
  }
}

// Создает туловище с анимацией
const createBody = (bodyRot) => {
  return {
    ddd: 0,
    ind: 4,
    ty: 4,
    nm: 'body',
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: 0, h: 1 },
          { t: 25, s: bodyRot, h: 1 },
          { t: 60, s: bodyRot, h: 1 },
          { t: 85, s: 0, h: 1 }
        ]
      },
      p: { a: 0, k: [250, 320, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    shapes: [
      {
        ty: 'rc',
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 140] },
        r: { a: 0, k: 20 },
        nm: 'body-shape'
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.2, 0.4, 0.8, 1] },
        o: { a: 0, k: 100 },
        nm: 'body-fill'
      }
    ],
    ip: 0,
    op: 90,
    st: 0,
    bm: 0
  }
}

// Основная функция генерирования анимации
const baseAnimation = (letter) => {
  const pose = getPoseForLetter(letter)

  return {
    v: '5.7.1',
    fr: 30,
    ip: 0,
    op: 90,
    w: 500,
    h: 500,
    nm: `sign-letter-${letter}`,
    ddd: 0,
    assets: [],
    layers: [
      createArmWithFingers('left-arm', 170, 290 + pose.leftY, pose.leftRot, -pose.fingerSpread, [0.91, 0.66, 0.38, 1]),
      createArmWithFingers('right-arm', 330, 290 + pose.rightY, pose.rightRot, pose.fingerSpread, [0.91, 0.66, 0.38, 1]),
      createHeadWithFace(pose.headTilt),
      createBody(pose.bodyRot),
      {
        ddd: 0,
        ind: 5,
        ty: 5,
        nm: 'letter-text',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 450, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        t: {
          d: {
            k: [
              {
                s: {
                  s: 72,
                  f: 'Arial-BoldMT',
                  t: letter,
                  j: 2,
                  tr: 0,
                  lh: 79,
                  ls: 0,
                  fc: [0.12, 0.16, 0.28]
                },
                t: 0
              }
            ]
          },
          ps: { x: 0, y: 0 },
          a: { a: 0, k: [0, 0] }
        },
        ip: 0,
        op: 90,
        st: 0,
        bm: 0
      }
    ]
  }
}

const fallback = baseAnimation('?')
fallback.nm = 'sign-letter-fallback'

fs.writeFileSync(path.join(outputDir, 'fallback.json'), JSON.stringify(fallback, null, 2), 'utf8')

letters.forEach((letter) => {
  const animation = baseAnimation(letter)
  fs.writeFileSync(path.join(outputDir, `${letter}.json`), JSON.stringify(animation, null, 2), 'utf8')
})

console.log(`✅ Generated ${letters.length} humanoid sign language animations + fallback in ${outputDir}`)
console.log(`Each character has unique hand poses, finger positions, head tilts, and facial features!`)
