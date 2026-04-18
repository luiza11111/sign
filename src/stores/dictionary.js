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
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await apiClient.get('/api/dictionary')
        dictionary.value = response.data
      } catch (error) {
        console.error('Error loading dictionary:', error)
        loadFromLocalStorageFallback()
      }
    } else {
      loadFromLocalStorageFallback()
    }
  }

  // Fallback to localStorage
  const loadFromLocalStorageFallback = () => {
    const saved = localStorage.getItem('signDictionary')
    if (saved) {
      dictionary.value = JSON.parse(saved)
    } else {
      // Default dictionary
      dictionary.value = [
        { id: 1, text: "сәлем", video: "/videos/salem.mp4", category: "сәлемдесу" },
        { id: 2, text: "рахмет", video: "/videos/rahmet.mp4", category: "сөздер" },
        { id: 3, text: "қалайсың", video: "/videos/kalaysyn.mp4", category: "сұрақ" },
        { id: 4, text: "мен", video: "/videos/men.mp4", category: "есімдік" },
        { id: 5, text: "сен", video: "/videos/sen.mp4", category: "есімдік" },
        { id: 6, text: "иә", video: "/videos/iya.mp4", category: "жауап" },
        { id: 7, text: "жоқ", video: "/videos/jok.mp4", category: "жауап" },
        { id: 8, text: "үй", video: "/videos/uy.mp4", category: "зат" },
        { id: 9, text: "мектеп", video: "/videos/mektep.mp4", category: "орын" },
        { id: 10, text: "университет", video: "/videos/universitet.mp4", category: "орын" },
        { id: 11, text: "барамын", video: "/videos/baramyn.mp4", category: "етістік" },
        { id: 12, text: "келемін", video: "/videos/kelemin.mp4", category: "етістік" },
        { id: 13, text: "су", video: "/videos/su.mp4", category: "зат" },
        { id: 14, text: "тамак", video: "/videos/tamak.mp4", category: "зат" },
        { id: 15, text: "қалай", video: "/videos/kalay.mp4", category: "сұрақ" },
        { id: 16, text: "жақсы", video: "/videos/jaksy.mp4", category: "сын" },
        { id: 17, text: "жаман", video: "/videos/jaman.mp4", category: "сын" },
        { id: 18, text: "кітап", video: "/videos/kitap.mp4", category: "зат" },
        { id: 19, text: "компьютер", video: "/videos/kompyuter.mp4", category: "зат" },
        { id: 20, text: "телефон", video: "/videos/telefon.mp4", category: "зат" },
        { id: 21, text: "сәлеметсіз бе", video: "/videos/salemetsizbe.mp4", category: "сәлемдесу" },
        { id: 22, text: "қош бол", video: "/videos/koshbol.mp4", category: "қоштасу" },
        { id: 23, text: "маған", video: "/videos/magan.mp4", category: "есімдік" },
        { id: 24, text: "саған", video: "/videos/sagan.mp4", category: "есімдік" },
        { id: 25, text: "көмек", video: "/videos/komek.mp4", category: "сөздер" },
        { id: 26, text: "дәрігер", video: "/videos/dariger.mp4", category: "адам" },
        { id: 27, text: "достар", video: "/videos/dostar.mp4", category: "адам" },
        { id: 28, text: "отбасы", video: "/videos/otbasy.mp4", category: "адам" },
        { id: 29, text: "махаббат", video: "/videos/mahabbat.mp4", category: "сезім" },
        { id: 30, text: "рахмет көп", video: "/videos/rahmetkop.mp4", category: "сөздер" }
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