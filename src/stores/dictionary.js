import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '../api'

export const useDictionaryStore = defineStore('dictionary', () => {
  const dictionary = ref([])

  const addWord = async (newWord) => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await apiClient.post('/api/dictionary', {
          text: newWord.text.toLowerCase(),
          video_url: newWord.video,
          category: newWord.category || "басқа"
        })
        dictionary.value.push(response.data)
      } catch (error) {
        console.error('Error adding word:', error)
        throw error
      }
    } else {
      // Fallback to localStorage
      const maxId = Math.max(...dictionary.value.map(w => w.id), 0)
      dictionary.value.push({
        id: maxId + 1,
        text: newWord.text.toLowerCase(),
        video: newWord.video,
        category: newWord.category || "басқа"
      })
      saveToLocalStorage()
    }
  }

  const deleteWord = async (id) => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await apiClient.delete(`/api/dictionary/${id}`)
        dictionary.value = dictionary.value.filter(w => w.id !== id)
      } catch (error) {
        console.error('Error deleting word:', error)
        throw error
      }
    } else {
      dictionary.value = dictionary.value.filter(w => w.id !== id)
      saveToLocalStorage()
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('signDictionary', JSON.stringify(dictionary.value))
  }

  // LocalStorage-дан жүктеу (теперь из API)
  const loadFromLocalStorage = async () => {
    try {
      const response = await apiClient.get('/api/sign-videos')
      dictionary.value = response.data.map(item => ({
        id: item.id || item.kazakh,
        kazakh: item.kazakh,
        russian: item.russian,
        links: item.links || (item.video_url ? [item.video_url] : []),
        video_url: item.video_url || (item.links && item.links[0]) || null,
        category: item.category || item.category || null
      }))
      return
    } catch (error) {
      console.error('Error loading dictionary from sign-videos:', error)
      loadFromLocalStorageFallback()
    }
  }

  // Fallback to localStorage
  const loadFromLocalStorageFallback = () => {
    const saved = localStorage.getItem('signDictionary')
    if (saved) {
      dictionary.value = JSON.parse(saved)
    } else {
      // Default dictionary - только внешние ссылки из video_links.json
      dictionary.value = [
        { id: 1, kazakh: 'сәлем', russian: 'привет', video_url: 'https://media.spreadthesign.com/video/mp4/12/17658.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/17658.mp4'], category: 'сәлемдесу' },
        { id: 2, kazakh: 'рахмет', russian: 'спасибо', video_url: 'https://media.spreadthesign.com/video/mp4/12/176094.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/176094.mp4'], category: 'сөздер' },
        { id: 3, kazakh: 'қалайсың', russian: 'как дела', video_url: 'https://media.spreadthesign.com/video/mp4/12/6155.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/6155.mp4'], category: 'сұрақ' },
        { id: 4, kazakh: 'мен', russian: 'я', video_url: 'https://media.spreadthesign.com/video/mp4/12/12345.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12345.mp4'], category: 'есімдік' },
        { id: 5, kazakh: 'сен', russian: 'ты', video_url: 'https://media.spreadthesign.com/video/mp4/12/12346.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12346.mp4'], category: 'есімдік' },
        { id: 6, kazakh: 'иә', russian: 'да', video_url: 'https://media.spreadthesign.com/video/mp4/12/4126.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/4126.mp4'], category: 'жауап' },
        { id: 7, kazakh: 'жоқ', russian: 'нет', video_url: 'https://media.spreadthesign.com/video/mp4/12/4136.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/4136.mp4'], category: 'жауап' },
        { id: 8, kazakh: 'үй', russian: 'дом', video_url: 'https://media.spreadthesign.com/video/mp4/12/349173.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/349173.mp4'], category: 'зат' },
        { id: 9, kazakh: 'мектеп', russian: 'школа', video_url: 'https://media.spreadthesign.com/video/mp4/12/12347.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12347.mp4'], category: 'орын' },
        { id: 10, kazakh: 'университет', russian: 'университет', video_url: 'https://media.spreadthesign.com/video/mp4/12/32309.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/32309.mp4'], category: 'орын' },
        { id: 11, kazakh: 'барамын', russian: 'иду', video_url: 'https://media.spreadthesign.com/video/mp4/12/12348.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12348.mp4'], category: 'етістік' },
        { id: 12, kazakh: 'келемін', russian: 'приду', video_url: 'https://media.spreadthesign.com/video/mp4/12/12349.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12349.mp4'], category: 'етістік' },
        { id: 13, kazakh: 'су', russian: 'вода', video_url: 'https://media.spreadthesign.com/video/mp4/12/12350.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12350.mp4'], category: 'зат' },
        { id: 14, kazakh: 'тамак', russian: 'еда', video_url: 'https://media.spreadthesign.com/video/mp4/12/12351.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12351.mp4'], category: 'зат' },
        { id: 15, kazakh: 'қалай', russian: 'как', video_url: 'https://media.spreadthesign.com/video/mp4/12/12352.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12352.mp4'], category: 'сұрақ' },
        { id: 16, kazakh: 'жақсы', russian: 'хорошо', video_url: 'https://media.spreadthesign.com/video/mp4/12/176103.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/176103.mp4'], category: 'сын' },
        { id: 17, kazakh: 'жаман', russian: 'плохо', video_url: 'https://media.spreadthesign.com/video/mp4/12/12353.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12353.mp4'], category: 'сын' },
        { id: 18, kazakh: 'кітап', russian: 'книга', video_url: 'https://media.spreadthesign.com/video/mp4/12/12354.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12354.mp4'], category: 'зат' },
        { id: 19, kazakh: 'компьютер', russian: 'компьютер', video_url: 'https://media.spreadthesign.com/video/mp4/12/12355.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12355.mp4'], category: 'зат' },
        { id: 20, kazakh: 'телефон', russian: 'телефон', video_url: 'https://media.spreadthesign.com/video/mp4/12/12356.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12356.mp4'], category: 'зат' },
        { id: 21, kazakh: 'сәлеметсіз бе', russian: 'здравствуйте', video_url: 'https://media.spreadthesign.com/video/mp4/12/12357.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12357.mp4'], category: 'сәлемдесу' },
        { id: 22, kazakh: 'қош бол', russian: 'пока', video_url: 'https://media.spreadthesign.com/video/mp4/12/12358.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12358.mp4'], category: 'қоштасу' },
        { id: 23, kazakh: 'маған', russian: 'мне', video_url: 'https://media.spreadthesign.com/video/mp4/12/12359.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12359.mp4'], category: 'есімдік' },
        { id: 24, kazakh: 'саған', russian: 'тебе', video_url: 'https://media.spreadthesign.com/video/mp4/12/12360.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12360.mp4'], category: 'есімдік' },
        { id: 25, kazakh: 'көмек', russian: 'помощь', video_url: 'https://media.spreadthesign.com/video/mp4/12/2098.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/2098.mp4'], category: 'сөздер' },
        { id: 26, kazakh: 'дәрігер', russian: 'врач', video_url: 'https://media.spreadthesign.com/video/mp4/12/12361.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12361.mp4'], category: 'адам' },
        { id: 27, kazakh: 'достар', russian: 'друзья', video_url: 'https://media.spreadthesign.com/video/mp4/12/12362.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12362.mp4'], category: 'адам' },
        { id: 28, kazakh: 'отбасы', russian: 'семья', video_url: 'https://media.spreadthesign.com/video/mp4/12/12363.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12363.mp4'], category: 'адам' },
        { id: 29, kazakh: 'махаббат', russian: 'любовь', video_url: 'https://media.spreadthesign.com/video/mp4/12/12364.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12364.mp4'], category: 'сезім' },
        { id: 30, kazakh: 'рахмет көп', russian: 'спасибо большое', video_url: 'https://media.spreadthesign.com/video/mp4/12/12365.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/12365.mp4'], category: 'сөздер' },
        { id: 31, kazakh: 'мен университет оқимын', russian: 'я учусь в университете', video_url: 'https://media.spreadthesign.com/video/mp4/12/108750.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/108750.mp4'], category: 'сөйлем' },
        { id: 32, kazakh: 'керемет', russian: 'отлично', video_url: 'https://media.spreadthesign.com/video/mp4/12/108652.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/108652.mp4'], category: 'сын' },
        { id: 33, kazakh: 'маған үйге бару керек', russian: 'мне нужно идти домой', video_url: 'https://media.spreadthesign.com/video/mp4/12/107731.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/107731.mp4'], category: 'сөйлем' },
        { id: 34, kazakh: 'отырмын', russian: 'я сижу', video_url: 'https://media.spreadthesign.com/video/mp4/12/17011.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/17011.mp4'], category: 'етістік' },
        { id: 35, kazakh: 'нестеп жатырсың', russian: 'что делаешь', video_url: 'https://media.spreadthesign.com/video/mp4/12/321216.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/321216.mp4'], category: 'сұрақ' },
        { id: 36, kazakh: 'сау бол', russian: 'пока', video_url: 'https://media.spreadthesign.com/video/mp4/12/100036.mp4', links: ['https://media.spreadthesign.com/video/mp4/12/100036.mp4'], category: 'қоштасу' }
      ]
    }
  }

  return {
    dictionary,
    addWord,
    deleteWord,
    loadFromLocalStorage
  }
})