# 🤖 Grok AI Bot - Быстрый Старт

## ⚡ 30 секунд настройки

### ✅ Уже готово:
- Backend endpoint: **`POST /api/grok`**
- API ключ: **Установлен в `.env`**
- Аутентификация: **JWT токен**
- База данных: **История сохраняется**

---

## 📡 Использование

### 1️⃣ Backend запрос (curl):
```bash
curl -X POST http://localhost:4000/api/grok \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет, как дела?"}'
```

### 2️⃣ Frontend (JavaScript):
```javascript
import grokService from '@/services/grokService';

async function askGrok(question) {
  try {
    const response = await grokService.sendMessage(question, token);
    console.log(response.response); // Ответ Grok
  } catch (error) {
    console.error('Ошибка:', error);
  }
}
```

### 3️⃣ React компонент:
```jsx
import { useState } from 'react';
import grokService from '@/services/grokService';

export function ChatBot() {
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    const result = await grokService.sendMessage(message, token);
    setResponse(result.response);
  };

  return (
    <div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Отправить</button>
      <p>{response}</p>
    </div>
  );
}
```

---

## 🔧 Конфигурация

### Проверить API ключ:
```bash
# Windows
echo %XAI_API_KEY%

# macOS/Linux
echo $XAI_API_KEY
```

### Запустить сервер:
```bash
cd server
npm run dev
# Сервер на http://localhost:4000
```

---

## 📊 API Ответ

```json
{
  "message": "Твой вопрос",
  "response": "Ответ от Grok AI",
  "timestamp": "2026-05-27T21:14:30.072Z"
}
```

---

## ✨ Особенности

| Функция | Статус |
|---------|--------|
| Текстовые запросы | ✅ |
| История сообщений | ✅ |
| Аутентификация | ✅ |
| Хранение в БД | ✅ |
| Обработка ошибок | ✅ |
| Многоязычность | ✅ |

---

## 🚀 Развертывание

### На Render.com:
1. Push код в GitHub
2. Подключить репозиторий к Render
3. Установить `.env` переменные
4. Деплой автоматический

### На других сервисах:
- Railway.app
- Vercel (фронтенд) + любой backend
- Heroku
- DigitalOcean

---

## 📞 Поддержка

| Проблема | Решение |
|----------|---------|
| 401 Unauthorized | Проверь JWT токен |
| 500 Server Error | Проверь логи, API ключ |
| CORS ошибка | Проверь CORS конфиг |
| БД не работает | Проверь DATABASE_URL |

---

## 📚 Документация

- **Полная инструкция:** `GROK_INTEGRATION.md`
- **Подробный отчет:** `GROK_SETUP_SUMMARY.md`
- **Этот файл:** `GROK_QUICK_START.md`

---

## 🎯 Готово к использованию! ✅

Просто начни использовать `/api/grok` endpoint в своем приложении.
