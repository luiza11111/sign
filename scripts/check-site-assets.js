import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())
const dactylDir = path.join(root, 'public', 'images', 'dactyl')
const videosDir = path.join(root, 'public', 'videos')
const lottieDir = path.join(root, 'public', 'lottie')

const expectedDactylLetters = [
  'А','Ә','Б','В','Г','Ғ','Д','Е','Ж','З','И','Й','К','Л','М','Н','Ң','О','Ө','П','Р','С','Т','У','Ұ','Ү','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','І','Ь','Э','Ю','Я','Һ','Қ'
]

const readDir = (dir) => {
  try {
    return fs.readdirSync(dir).filter((name) => !name.startsWith('.'))
  } catch (err) {
    console.error(`Cannot read directory: ${dir}`)
    return []
  }
}

const normalize = (name) => name.toUpperCase()

const checkDactyl = () => {
  const files = readDir(dactylDir)
  const normalized = files.map(normalize)
  const expected = expectedDactylLetters.map((letter) => `${letter}.MP4`)
  const missing = expected.filter((name) => !normalized.includes(name))
  const extra = normalized.filter((name) => !expected.includes(name))

  console.log('Dactyl assets:')
  console.log(`  folder: ${dactylDir}`)
  console.log(`  files count: ${files.length}`)
  console.log(`  expected letters: ${expectedDactylLetters.length}`)
  console.log(`  missing files: ${missing.length}`)
  if (missing.length) console.log(`    ${missing.join(', ')}`)
  console.log(`  extra files: ${extra.length}`)
  if (extra.length) console.log(`    ${extra.join(', ')}`)
  console.log('')
}

const checkDirectory = (name, dir) => {
  const files = readDir(dir)
  console.log(`${name}:`)
  console.log(`  folder: ${dir}`)
  console.log(`  entries: ${files.length}`)
  if (files.length <= 50) {
    console.log(`  list: ${files.join(', ')}`)
  } else {
    console.log(`  first entries: ${files.slice(0, 50).join(', ')}`)
  }
  console.log('')
}

console.log('=== Site asset check ===')
checkDactyl()
checkDirectory('Video assets', videosDir)
checkDirectory('Lottie assets', lottieDir)
console.log('Note: This check validates Dactyl mp4 names, public/videos content, and public/lottie assets.')
