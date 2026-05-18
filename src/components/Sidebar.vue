<template>
  <aside class="sidebar">
    <div class="logo">
      <Logo variant="monogram" size="md" :showTagline="false" />
    </div>

    <nav class="nav-menu">
      <div class="nav-section">
        <p class="section-title" data-i18n="menu">МЕНЮ</p>
        <ul>
          <li :class="{ active: $route.path === '/' }">
            <router-link to="/">
              <Home class="nav-icon" :size="18" />
              <span data-i18n="home">Басты бет</span>
            </router-link>
          </li>
          <li :class="{ active: $route.path === '/translate' }">
            <router-link to="/translate">
              <Languages class="nav-icon" :size="18" />
              <span data-i18n="translate">Аударма</span>
            </router-link>
          </li>
          <li :class="{ active: $route.path === '/history' }">
            <router-link to="/history">
              <Clock class="nav-icon" :size="18" />
              <span data-i18n="history">Тарих</span>
            </router-link>
          </li>
          <li :class="{ active: $route.path === '/frequent' }">
            <router-link to="/frequent">
              <Star class="nav-icon" :size="18" />
              <span data-i18n="frequent">Жиі сөздер</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <p class="section-title" data-i18n="additional">ҚОСЫМША</p>
        <ul>
          <li :class="{ active: $route.path === '/profile' }">
            <router-link to="/profile">
              <User class="nav-icon" :size="18" />
              <span data-i18n="profile">Профиль</span>
            </router-link>
          </li>
          <li :class="{ active: $route.path === '/help' }">
            <router-link to="/help">
              <HelpCircle class="nav-icon" :size="18" />
              <span data-i18n="help">Көмек</span>
            </router-link>
          </li>
          <li v-if="isAdmin" :class="{ active: $route.path === '/admin' }">
            <router-link to="/admin">
              <Shield class="nav-icon" :size="18" />
              <span data-i18n="admin">Админ панель</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="user-info">
      <div class="avatar">{{ userInitials }}</div>
      <div class="user-details">
        <p class="user-name">{{ userName }}</p>
        <p class="user-role" data-i18n="admin_role">{{ userRole }}</p>
      </div>
      <button class="logout-icon" @click="handleLogout">
        <LogOut class="logout-icon-symbol" :size="18" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { loadLanguage, translatePage, t } from '../i18n'

// Lucide иконкалары
import { 
  Home, Languages, Clock, Star, 
  User, HelpCircle, Shield, LogOut 
} from 'lucide-vue-next'
// Логотип компоненті
import Logo from './Logo.vue'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || t('user'))
const userRole = computed(() => authStore.user?.role === 'admin' ? t('admin_role') : t('user_role'))
const userInitials = computed(() => userName.value.charAt(0).toUpperCase())
const isAdmin = computed(() => authStore.isAdmin())

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadLanguage()
  translatePage()
  
  window.addEventListener('languageChanged', () => {
    translatePage()
  })
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--sidebar-bg, white);
  border-radius: 28px;
  margin: 16px 0 16px 16px;
  display: flex;
  flex-direction: column;
  padding: 28px 20px;
  position: fixed;
  height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-color, #eef2f6);
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f0f2f5;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.logo {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.nav-menu {
  flex: 1;
}

.nav-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-bottom: 12px;
  padding-left: 12px;
}

.nav-menu ul {
  list-style: none;
}

.nav-menu li {
  margin-bottom: 4px;
}

.nav-menu li a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 16px;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
}

.nav-menu li a:hover {
  background: #f1f5f9;
  color: #6366f1;
}

.nav-menu li.active a {
  background: linear-gradient(135deg, #eef2ff, #f0e6ff);
  color: #6366f1;
  font-weight: 600;
}

:root.dark-theme .nav-menu li a {
  color: var(--text-secondary);
}

:root.dark-theme .nav-menu li a:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #8b5cf6;
}

:root.dark-theme .nav-menu li.active a {
  background: rgba(99, 102, 241, 0.2);
  color: #8b5cf6;
}

:root.dark-theme .section-title {
  color: var(--text-secondary);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  margin-top: 16px;
  border-top: 1px solid var(--border-color, #eef2f6);
}

.avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

:root.dark-theme .user-name {
  color: var(--text-primary);
}

.user-role {
  font-size: 11px;
  color: #94a3b8;
}

:root.dark-theme .user-role {
  color: var(--text-secondary);
}

.logout-icon {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-icon:hover {
  opacity: 1;
  background: #f1f5f9;
}

:root.dark-theme .logout-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.logout-icon-symbol {
  width: 18px;
  height: 18px;
}

/* Мобильді */
@media (max-width: 1024px) {
  .sidebar {
    width: 90px;
    padding: 24px 12px;
  }
  
  .sidebar .section-title,
  .sidebar .nav-menu li a span:last-child,
  .sidebar .user-details {
    display: none;
  }
  
  .sidebar .nav-menu li a {
    justify-content: center;
    padding: 12px;
  }
  
  .sidebar .user-info {
    justify-content: center;
  }
  
  .logo {
    margin-bottom: 24px;
  }
}
</style>