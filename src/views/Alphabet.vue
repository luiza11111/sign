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
        <div class="letter-symbol">{{ letter.letter }}</div>
        <div>
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
  { letter: 'А', name: 'А', description: 'Қол ашық, саусақтар бірге. Қимыл жылдам және оқшауланған.' },
  { letter: 'Ә', name: 'Ә', description: 'Ұқсас, бірақ саусақтардың ұшы ашық болып қалады.' },
  { letter: 'Б', name: 'Б', description: 'Бас бармақ жоғары, қалған саусақтар жабыңыз.' },
  { letter: 'В', name: 'В', description: 'Екі саусақ көрсеткіші мен орташа бірге көтерілген.' },
  { letter: 'Г', name: 'Г', description: 'Қол мен саусақтың қалыпты бұрылуы бар.' },
  { letter: 'Д', name: 'Д', description: 'Барлық саусақтар бір-біріне жанасады, алақан ашық.' },
  { letter: 'Е', name: 'Е', description: 'Қол жеңіл бүгіліп, саусақтар алшақ.' },
  { letter: 'Ж', name: 'Ж', description: 'Қол саусақтары қайшыласып, орташа қалыпта болады.' },
  { letter: 'З', name: 'З', description: 'Саусақтар аздап бүгіліп, кішігірім қозғалыс бар.' },
  { letter: 'И', name: 'И', description: 'Қолдың көрсеткіші байлаулы, қалған саусақтар сабында.' },
  { letter: 'К', name: 'К', description: 'Көрсеткіш және орташа саусақтар кеңірек ашық.' },
  { letter: 'Қ', name: 'Қ', description: 'Қолдың артқы жағы көтеріледі, сөз дәлме-дәл.' },
  { letter: 'Л', name: 'Л', description: 'Көрсеткіш пен орташа саусақ бірге, қалғандары бүгіледі.' },
  { letter: 'М', name: 'М', description: 'Барлық саусақтар біріктірілген, алақан қысқа қимылда.' },
  { letter: 'Н', name: 'Н', description: 'Орташа қалпында, жұқа қозғалыстармен.' },
  { letter: 'Ң', name: 'Ң', description: 'Н-ға ұқсас, бірақ бас бармақ арнайы бағытталады.' },
  { letter: 'О', name: 'О', description: 'Қол дөңгелек пішінде, барлық саусақтар бірге.' },
  { letter: 'Ө', name: 'Ө', description: 'О-ға ұқсас, бірақ саусақтар арасында кішкене ашықтық бар.' },
  { letter: 'П', name: 'П', description: 'Қол алдыңғыға қарай бағытталған, қатты белгі.' },
  { letter: 'Р', name: 'Р', description: 'Көрсеткіш саусақ алға, қалғандары қысқа бұрылады.' },
  { letter: 'С', name: 'С', description: 'Алақан кең ашық, жұмсақ қуатпен.' },
  { letter: 'Т', name: 'Т', description: 'Қол сағасына параллель, терең емес.*' },
  { letter: 'У', name: 'У', description: 'У-ға тән қол конфигурациясы мен бағыт.' },
  { letter: 'Ұ', name: 'Ұ', description: 'У-ға ұқсас, бірақ саусақтар бағыты өзгеше.' },
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
  margin-bottom: 12px;
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
