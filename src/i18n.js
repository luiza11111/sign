import { ref } from 'vue'

const currentLanguage = ref('kk')

const messages = {
  kk: {
    nav: {
      home: 'Басты бет',
      translate: 'Аударма',
      history: 'Тарих',
      frequent: 'Жиі сөздер',
      profile: 'Профиль',
      help: 'Көмек',
      admin: 'Админ панель'
    },
    profile: {
      title: 'Профиль',
      subtitle: 'Жеке ақпаратыңыз және параметрлеріңіз',
      notifications: 'Хабарландырулар',
      darkMode: 'Қараңғы режим',
      language: 'Тіл',
      save: 'Сақтау'
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      translate: 'Перевод',
      history: 'История',
      frequent: 'Частые слова',
      profile: 'Профиль',
      help: 'Помощь',
      admin: 'Панель администратора'
    },
    profile: {
      title: 'Профиль',
      subtitle: 'Ваша личная информация и параметры',
      notifications: 'Уведомления',
      darkMode: 'Тёмный режим',
      language: 'Язык',
      save: 'Сохранить'
    }
  },
  en: {
    nav: {
      home: 'Home',
      translate: 'Translate',
      history: 'History',
      frequent: 'Frequent Words',
      profile: 'Profile',
      help: 'Help',
      admin: 'Admin Panel'
    },
    profile: {
      title: 'Profile',
      subtitle: 'Your personal information and settings',
      notifications: 'Notifications',
      darkMode: 'Dark Mode',
      language: 'Language',
      save: 'Save'
    }
  }
}

export const setLanguage = (lang) => {
  currentLanguage.value = lang
  localStorage.setItem('appLanguage', lang)
}

export const getLanguage = () => currentLanguage.value

export const t = (path) => {
  const keys = path.split('.')
  let value = messages[currentLanguage.value]
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || path
}
