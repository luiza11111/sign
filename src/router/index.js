import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Аутентификация беттері
    { 
      path: '/login', 
      name: 'Login', 
      component: () => import('../views/Login.vue'),
      meta: { guestOnly: true }
    },
    { 
      path: '/register', 
      name: 'Register', 
      component: () => import('../views/Register.vue'),
      meta: { guestOnly: true }
    },
    
    // Негізгі беттер (авторизация қажет)
    { 
      path: '/', 
      name: 'Home', 
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    
    // Аударма беті
    { 
      path: '/translate', 
      name: 'Translate', 
      component: () => import('../views/Translate.vue'),
      meta: { requiresAuth: true }
    },
    
    // Тарих беті
    { 
      path: '/history', 
      name: 'History', 
      component: () => import('../views/History.vue'),
      meta: { requiresAuth: true }
    },
    
    // Жиі сөздер беті
    { 
      path: '/frequent', 
      name: 'Frequent', 
      component: () => import('../views/Frequent.vue'),
      meta: { requiresAuth: true }
    },
    
    // Профиль беті
    { 
      path: '/profile', 
      name: 'Profile', 
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    
    // Көмек беті
    { 
      path: '/help', 
      name: 'Help', 
      component: () => import('../views/Help.vue'),
      meta: { requiresAuth: true }
    },
    
    // Қазақ ым тілінің алфавиті
    { 
      path: '/alphabet', 
      name: 'Alphabet', 
      component: () => import('../views/Alphabet.vue'),
      meta: { requiresAuth: true }
    },

    // Админ панелі (тек админдер үшін)
    { 
      path: '/admin', 
      name: 'Admin', 
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    
    // 404 - Табылмады беті
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// Route Guard (Навигациялық қорғаныс)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Аутентификация күйін инициализациялау
  authStore.initAuth()
  
  const isLoggedIn = authStore.isLoggedIn
  const isDemoMode = authStore.isDemoMode
  const isAdminUser = authStore.isAdmin()

  // デモモード：すべてのページにアクセス可能
  if (isDemoMode) {
    return next()
  }

  // Егер бет авторизация қажет етсе және қолданушы кірмеген болса
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // Если маршрут только для гостей (login/register) и пользователь уже залогинен — перенаправляем на Home
  if (to.meta.guestOnly && isLoggedIn) {
    return next('/')
  }

  // Если нужен админ, но пользователь не админ — редирект на Home
  if (to.meta.requiresAdmin && !isAdminUser) {
    return next('/')
  }

  // По умолчанию продолжаем навигацию
  return next()
})

export default router