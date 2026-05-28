// Grok API қызметі (xAI)
const API_KEY = import.meta.env.VITE_XAI_API_KEY
const API_URL = 'https://api.x.ai/v1/chat/completions'

// Жүйелік нұсқау (біздің боттың мінез-құлқы)
const SYSTEM_PROMPT = `Сен QosQol көмекшісісің. QosQol - қазақ ым тіліне аударатын веб-қосымша.

Сенің міндетің:
- Пайдаланушыға жылы, көмекші және достық болу
- Қазақша, орысша немесе ағылшынша сұрақтарға жауап беру
- Қысқа және нақты жауап беру (максимум 3-4 сөйлем)

Жауап беру ережелері:
- Кез келген сұраққа ақылды және пайдалы жауап беру
- Ешқандай зиянды кеңес бермеу
- Әрқашан көмектесуге дайын болу
- Эмодзи қолдануға рұқсат (🤟, 😊, ✅ сияқты)`

// Оффлайн жауаптар (API жұмыс істемегенде)
function getOfflineResponse(message) {
  const q = message.toLowerCase()
  
  if (q.includes('сәлем') || q.includes('салем') || q.includes('hello')) {
    return 'Сәлем! Мен QosQol көмекшісімін. Қазақ ым тіліне аударма жасауға көмектесемін! 🤟'
  }
  if (q.includes('аудар') || q.includes('translate')) {
    return 'Мәтінді жоғарғы өріске енгізіп, "Аудару" батырмасын басыңыз. Сондай-ақ дауыстық енгізуді қолдануға болады! 🎤'
  }
  if (q.includes('дауыс') || q.includes('voice')) {
    return 'Микрофон батырмасын басып, сөйлеңіз. Браузер сіздің дауысыңызды мәтінге айналдырады. 🎙️'
  }
  if (q.includes('тарих') || q.includes('history')) {
    return 'Барлық аудармаларыңыз "Тарих" бетінде сақталады. Оларды кез келген уақытта көре аласыз. 📜'
  }
  if (q.includes('рахмет') || q.includes('thank')) {
    return 'Қош келдіңіз! Кез келген уақытта көмектесуге дайынмын! 😊'
  }
  
  return 'Мен QosQol көмекшісімін. Кез келген сұрағыңызды қоюға болады! Қазақ ым тілі, аударма, немесе кез келген тақырып бойынша сұраңыз. 🤖'
}

// Жауап алу функциясы
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1500 // 1.5 секунд (429 қатесін болдырмау үшін)

export async function getGrokResponse(userMessage) {
  // API кілтін тексеру
  if (!API_KEY || API_KEY === 'undefined') {
    console.error('API кілт табылмады! .env файлына VITE_XAI_API_KEY қосыңыз.')
    return getOfflineResponse(userMessage)
  }

  // Сұрау арасындағы кідірісті тексеру
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    console.log(`Кідіріс: ${waitTime}мс (лимитті болдырмау үшін)`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  lastRequestTime = Date.now()

  try {
    console.log('Grok API-ға сұрау жіберілуде...')
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4.1-fast',  // Ең жылдам және арзан модель
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Grok API қатесі:', errorData)
      
      // 429 қатесі - тым көп сұрау
      if (response.status === 429) {
        return 'Қазір сұрақтар көп түсіп тұр. Бір минуттан кейін қайталап көріңіз. 😅'
      }
      
      return getOfflineResponse(userMessage)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content
    
    if (aiResponse) {
      console.log('Grok жауабы алынды:', aiResponse.substring(0, 50) + '...')
      return aiResponse
    } else {
      return getOfflineResponse(userMessage)
    }
  } catch (error) {
    console.error('API қатесі:', error)
    return getOfflineResponse(userMessage)
  }
}