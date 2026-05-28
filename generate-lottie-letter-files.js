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

const baseAnimation = (letter) => ({
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
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'left-arm',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [
          { t: 0, s: -20, h: 1 },
          { t: 30, s: 12, h: 1 },
          { t: 60, s: -20, h: 1 }
        ] },
        p: { a: 0, k: [170, 290, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [[0, -22], [0, 0], [12, 0], [0, 0]],
                  o: [[0, 22], [0, 0], [-12, 0], [0, 0]],
                  v: [[-40, -60], [40, -60], [40, 60], [-40, 60]],
                  c: true
                }
              },
              nm: 'arm-path'
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.95, 0.75, 0.58, 1] },
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
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'right-arm',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [
          { t: 0, s: 28, h: 1 },
          { t: 30, s: -10, h: 1 },
          { t: 60, s: 28, h: 1 }
        ] },
        p: { a: 0, k: [330, 290, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [[0, -22], [0, 0], [12, 0], [0, 0]],
                  o: [[0, 22], [0, 0], [-12, 0], [0, 0]],
                  v: [[-40, -60], [40, -60], [40, 60], [-40, 60]],
                  c: true
                }
              },
              nm: 'arm-path'
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.95, 0.75, 0.58, 1] },
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
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'body',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 320, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: 'rc',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [120, 170] },
          r: { a: 0, k: 28 },
          nm: 'body-rect'
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.24, 0.49, 0.74, 1] },
          o: { a: 0, k: 100 },
          nm: 'body-fill'
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: 'head',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 180, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [90, 90] },
          nm: 'head-ellipse'
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.98, 0.82, 0.65, 1] },
          o: { a: 0, k: 100 },
          nm: 'head-fill'
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 5,
      ty: 5,
      nm: 'letter-text',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 460, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      t: {
        d: {
          k: [
            {
              s: {
                s: 74,
                f: 'Arial-BoldMT',
                t: letter,
                j: 2,
                tr: 0,
                lh: 88,
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
})

const fallback = baseAnimation('?')
fallback.nm = 'sign-letter-fallback'

fs.writeFileSync(path.join(outputDir, 'fallback.json'), JSON.stringify(fallback, null, 2), 'utf8')

letters.forEach((letter) => {
  const animation = baseAnimation(letter)
  fs.writeFileSync(path.join(outputDir, `${letter}.json`), JSON.stringify(animation, null, 2), 'utf8')
})

console.log(`Generated ${letters.length} Lottie files plus fallback in ${outputDir}`)
