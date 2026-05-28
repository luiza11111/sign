// server/test-grok.js
// Тестирование Grok API интеграции

require('dotenv').config();
const axios = require('axios');

/**
 * Тест Grok API напрямую (без Express сервера)
 */
async function testGrokDirect() {
  console.log('🔄 Тестирование Grok API...');
  
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.error('❌ XAI_API_KEY не найден в .env');
    return;
  }

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/responses',
      {
        model: 'grok-4.20-reasoning',
        input: 'Привет! Как дела?'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('✅ Успешный ответ от Grok:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    if (err.response) {
      console.error('Статус:', err.response.status);
      console.error('Данные:', err.response.data);
    }
  }
}

/**
 * Пример использования через Express сервер
 */
function exampleExpressUsage() {
  console.log(`
╔════════════════════════════════════════╗
║  ПРИМЕР ИСПОЛЬЗОВАНИЯ GROK API         ║
╚════════════════════════════════════════╝

📍 Endpoint: POST /api/grok
🔐 Требуется: JWT токен (Authorization header)

┌─ Request ─────────────────────────────┐
│ POST http://localhost:4000/api/grok   │
│ Headers:                              │
│   Authorization: Bearer YOUR_JWT      │
│   Content-Type: application/json      │
│                                       │
│ Body:                                 │
│ {                                     │
│   "message": "Ваш вопрос"            │
│ }                                     │
└───────────────────────────────────────┘

┌─ Response ────────────────────────────┐
│ {                                     │
│   "message": "Ваш вопрос",           │
│   "response": "Ответ от Grok",       │
│   "timestamp": "2026-05-27T..."      │
│ }                                     │
└───────────────────────────────────────┘

📝 История сохраняется в БД автоматически
  ├─ user_id (из JWT)
  ├─ text (вопрос)
  ├─ translation (ответ)
  └─ created_at (время)
`);
}

/**
 * CURL примеры
 */
function curlExamples() {
  console.log(`
╔════════════════════════════════════════╗
║  ПРИМЕРЫ CURL ЗАПРОСОВ                 ║
╚════════════════════════════════════════╝

1️⃣ Прямой запрос к Grok API:
───────────────────────────────────────
curl https://api.x.ai/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
    "model": "grok-4.20-reasoning",
    "input": "Привет, как дела?"
  }'

2️⃣ Запрос через Express сервер:
───────────────────────────────────────
curl -X POST http://localhost:4000/api/grok \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Привет!"}'

3️⃣ Получить историю чата:
───────────────────────────────────────
curl http://localhost:4000/api/history \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`);
}

/**
 * JavaScript/Node.js пример
 */
function jsExample() {
  console.log(`
╔════════════════════════════════════════╗
║  ПРИМЕРЫ JAVASCRIPT/NODE.JS            ║
╚════════════════════════════════════════╝

📌 Пример с Fetch API:
───────────────────────────────────────
async function askGrok(message, token) {
  const response = await fetch('/api/grok', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({ message })
  });
  
  return await response.json();
}

// Использование:
const result = await askGrok('Что такое ИИ?', myToken);
console.log(result.response);

📌 Пример с готовым сервисом:
───────────────────────────────────────
import grokService from '@/services/grokService';

const response = await grokService.sendMessage(
  'Твой вопрос',
  jwtToken
);

console.log(response.response); // Ответ от Grok
`);
}

// Запуск тестов
async function main() {
  console.clear();
  
  exampleExpressUsage();
  console.log('\n');
  
  curlExamples();
  console.log('\n');
  
  jsExample();
  console.log('\n');
  
  // Раскомментируй для тестирования API ключа:
  // await testGrokDirect();
}

main().catch(console.error);
