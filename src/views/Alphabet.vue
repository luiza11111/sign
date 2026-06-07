<template>
  <div class="alphabet-page">
    <div class="page-header">
      <h1 data-i18n="alphabet_page_title">Қазақ ым тілінің алфавиті</h1>
      <p data-i18n="alphabet_page_intro">Бұл бетте қазақ ым тілінің бастапқы әріптері және негізгі қол белгілері сипатталған.</p>
    </div>

    <div class="alphabet-actions">
      <a
        class="download-btn"
        href="/files/kazakh-sign-language-basics.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>📄</span>
        <span data-i18n="alphabet_download_guide">PDF нұсқаулықты жүктеу</span>
      </a>
    </div>

    <div class="alphabet-grid">
      <div class="alphabet-card" v-for="letter in alphabet" :key="letter.letter">
        <div class="letter-container">
          <div class="letter-symbol">{{ letter.letter }}</div>
          <img 
            v-if="letter.image" 
            :src="letter.image" 
            :alt="`Дактиль әрібі ${letter.letter}`"
            class="dactyl-image"
            loading="lazy"
          />
          <div v-else class="dactyl-placeholder">
            <span>📷</span>
          </div>
        </div>
        <div class="letter-info">
          <h3>{{ letter.name }}</h3>
          <p>{{ letter.description }}</p>
        </div>
      </div>
    </div>

    <div class="alphabet-note">
      <h2 data-i18n="alphabet_practice_title">Жаттығу</h2>
      <p data-i18n="alphabet_practice_text">Әр әріпті қол қимылымен бірге қайталаңыз. Бұл қазақ ым тілін үйренудің ең жақсы жолы.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alphabet = ref([
  { letter: 'А', name: 'А', description: 'Қол ашық, саусақтар бірге. Қимыл жылдам және оқшауланған.', image: '/images/dactyl/a.jpg' },
  { letter: 'Ә', name: 'Ә', description: 'Ұқсас, бірақ саусақтардың ұшы ашық болып қалады.', image: '/images/dactyl/ae.jpg' },
  { letter: 'Б', name: 'Б', description: 'Бас бармақ жоғары, қалған саусақтар жабыңыз.', image: '/images/dactyl/b.jpg' },
  { letter: 'В', name: 'В', description: 'Екі саусақ көрсеткіші мен орташа бірге көтерілген.', image: '/images/dactyl/v.jpg' },
  { letter: 'Г', name: 'Г', description: 'Қол мен саусақтың қалыпты бұрылуы бар.', image: '/images/dactyl/g.jpg' },
  { letter: 'Ғ', name: 'Ғ', description: 'Барлық саусақтар бір-біріне жанасады, алақан ашық.', image: '/images/dactyl/gh.jpg' },
  { letter: 'Д', name: 'Д', description: 'Барлық саусақтар бір-біріне жанасады, алақан ашық.', image: '/images/dactyl/d.jpg' },
  { letter: 'Е', name: 'Е', description: 'Қол жеңіл бүгіліп, саусақтар алшақ.', image: '/images/dactyl/e.jpg' },
  { letter: 'Ж', name: 'Ж', description: 'Қол саусақтары қайшыласып, орташа қалыпта болады.', image: '/images/dactyl/zh.jpg' },
  { letter: 'З', name: 'З', description: 'Саусақтар аздап бүгіліп, кішігірім қозғалыс бар.', image: '/images/dactyl/z.jpg' },
  { letter: 'И', name: 'И', description: 'Қолдың көрсеткіші байлаулы, қалған саусақтар сабында.', image: '/images/dactyl/i.jpg' },
  { letter: 'К', name: 'К', description: 'Көрсеткіш және орташа саусақтар кеңірек ашық.', image: '/images/dactyl/k.jpg' },
  { letter: 'Қ', name: 'Қ', description: 'Қолдың артқы жағы көтеріледі, сөз дәлме-дәл.', image: '/images/dactyl/q.jpg' },
  { letter: 'Л', name: 'Л', description: 'Көрсеткіш пен орташа саусақ бірге, қалғандары бүгіледі.' },
  { letter: 'М', name: 'М', description: 'Барлық саусақтар біріктірілген, алақан қысқа қимылда.', image: '/images/dactyl/m.jpg' },
  { letter: 'Н', name: 'Н', description: 'Орташа қалпында, жұқа қозғалыстармен.', image: '/images/dactyl/n.jpg' },
  { letter: 'Ң', name: 'Ң', description: 'Н-ға ұқсас, бірақ бас бармақ арнайы бағытталады.', image: '/images/dactyl/ng.jpg' },
  { letter: 'О', name: 'О', description: 'Қол дөңгелек пішінде, барлық саусақтар бірге.', image: '/images/dactyl/o.jpg' },
  { letter: 'Ө', name: 'Ө', description: 'О-ға ұқсас, бірақ саусақтар арасында кішкене ашықтық бар.', image: '/images/dactyl/oe.jpg' },
  { letter: 'П', name: 'П', description: 'Қол алдыңғыға қарай бағытталған, қатты белгі.', image: '/images/dactyl/p.jpg' },
  { letter: 'Р', name: 'Р', description: 'Көрсеткіш саусақ алға, қалғандары қысқа бұрылады.', image: '/images/dactyl/r.jpg' },
  { letter: 'С', name: 'С', description: 'Алақан кең ашық, жұмсақ қуатпен.', image: '/images/dactyl/s.jpg' },
  { letter: 'Т', name: 'Т', description: 'Қол сағасына параллель, терең емес.', image: '/images/dactyl/t.jpg' },
  { letter: 'У', name: 'У', description: 'У-ға тән қол конфигурациясы мен бағыт.', image: '/images/dactyl/u.jpg' },
  { letter: 'Ұ', name: 'Ұ', description: 'У-ға ұқсас, бірақ саусақтар бағыты өзгеше.', image: '/images/dactyl/uu.jpg' },
  { letter: 'Ү', name: 'Ү', description: 'Ашық саусақтар, жоғары қарай бағытталған.' },
  { letter: 'Ф', name: 'Ф', description: 'Алақан мен саусақтар шеңбер құрайды.' },
  { letter: 'Х', name: 'Х', description: 'Қол салмақты, саусақтар біршама ашық.' },
  { letter: 'Һ', name: 'Һ', description: 'Х-қа ұқсас, бірақ жеңіл қозғалыс қосылады.' },
  { letter: 'Ц', name: 'Ц', description: 'Қол түзу, әйгілі белгісіне жақын.' },
  { letter: 'Ч', name: 'Ч', description: 'Үш саусақ бірге, қалғандары бүгіледі.' },
  { letter: 'Ш', name: 'Ш', description: 'Қолдың үш саусақ формасы кеңірек ашық.' },
  { letter: 'Щ', name: 'Щ', description: 'Ш-ға ұқсас, бірақ қозғалыс бағытында өзгешелік бар.' },
  { letter: 'Ы', name: 'Ы', description: 'Қол алақаны саусақтарымен жабысады, қысымсыз.' },
  { letter: 'І', name: 'І', description: 'Бір ғана саусақ көрсеткіші табиғи қалыпта.' },
  { letter: 'Ь', name: 'Ь', description: 'Жұмсақтықты білдіретін қосымша белгі.' },
  { letter: 'Э', name: 'Э', description: 'Ауыздық қозғалысқа ұқсас, жеңіл белгі.' },
  { letter: 'Ю', name: 'Ю', description: 'Үлкен болуы, барлық саусақтар біршама ашық.' },
  { letter: 'Я', name: 'Я', description: 'Бас бармақ және көрсеткіш белгісінің үйлесімі.' }
])
</script>

<style scoped>
.alphabet-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 12px;
}

.page-header p {
  color: #555;
  margin-bottom: 24px;
  line-height: 1.6;
}

.alphabet-actions {
  margin-bottom: 24px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: #054ada;
  color: #fff;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
}

.alphabet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.alphabet-card {
  background: #fff;
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 16px 32px rgba(14, 30, 60, 0.06);
}

.letter-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.letter-symbol {
  width: 60px;
  height: 60px;
  background: #f4f7ff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
}

.dactyl-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  max-height: 200px;
}

.dactyl-placeholder {
  width: 100%;
  min-height: 120px;
  background: #f0f4f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #cbd5e1;
}

.letter-info {
  flex: 1;
}

.alphabet-card h3 {
  margin-bottom: 8px;
}

.alphabet-card p {
  color: #4b545f;
  line-height: 1.6;
}

.alphabet-note {
  margin-top: 32px;
  padding: 24px;
  border-radius: 24px;
  background: #eef6ff;
}

.alphabet-note h2 {
  margin-bottom: 10px;
}

.alphabet-note p {
  color: #334155;
  line-height: 1.75;
}
</style>
