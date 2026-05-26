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
  const isAdminUser = authStore.isAdmin()

  // Егер бет авторизация қажет етсе және қолданушы кірмеген болса
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } 
  // Егер бет тек қонақтар үшін болса (login/register) және қолданушы кірген болса
  else if (to.meta.guestOnly && isLoggedIn) {
    next('/')
  }
  // Егер бет админ құқығын қажет етсе және қолданушы админ болмаса
  else if (to.meta.requiresAdmin && !isAdminUser) {
    next('/') // Админ емес адам /admin бетіне кірсе — Home-ға қайтарады
  } 
  // Құртынды жағдай: қолданушы / бетіне өндеген болса және авторизация қажет болса
  else if (to.path === '/' && !isLoggedIn && from.path === '/') {
    next('/login')
  }
  else {
    next()
  }
})

export default router