<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Сол жақ - Welcome блогы -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="logo-badge">
            <Hand class="logo-hand" :size="56" :stroke-width="1.5" />
          </div>
          <h1>Қош келдіңіз!</h1>
          <p class="welcome-text">
            Біздің кәсіби қауымдастыққа қосылыңыз. 
            Эксклюзивті мүмкіндіктерге қол жеткізу 
            және жекелендірілген тәжірибе алу үшін 
            аккаунт құрыңыз.
          </p>
          <div class="features">
            <div class="feature">
              <Sparkles class="feature-icon" :size="18" />
              <span>AI негізіндегі аударма</span>
            </div>
            <div class="feature">
              <Mic class="feature-icon" :size="18" />
              <span>Дауыстық басқару</span>
            </div>
            <div class="feature">
              <Smartphone class="feature-icon" :size="18" />
              <span>Барлық құрылғыға бейімделген</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Оң жақ - Форма блогы -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <LogIn class="header-icon" :size="28" />
            <h2>Кіру</h2>
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="input-group">
              <label>
                <Mail class="label-icon" :size="14" />
                Email
              </label>
              <div class="input-icon-wrapper">
                <Mail class="input-icon" :size="18" />
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div class="input-group">
              <label>
                <Lock class="label-icon" :size="14" />
                Пароль
              </label>
              <div class="input-icon-wrapper password-wrapper">
                <Lock class="input-icon" :size="18" />
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="*********"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe">
                <span>Есте сақтау</span>
              </label>
              <a href="#" class="forgot-link">
                <KeyRound :size="12" />
                Ұмыттыңыз ба?
              </a>
            </div>

            <button type="submit" :disabled="loading" class="login-btn">
              <LogIn v-if="!loading" :size="18" />
              <Loader2 v-else class="spinner-icon" :size="18" />
              <span>{{ loading ? 'Кіруде...' : 'Кіру' }}</span>
            </button>
          </form>

          <div class="divider">
            <span>немесе</span>
          </div>

          <button class="google-btn">
            <Chrome class="google-icon" :size="18" />
            Google арқылы кіру
          </button>

          <div class="register-prompt">
            <p>Аккаунтыңыз жоқ па? 
              <router-link to="/register" class="register-link">
                <UserPlus :size="14" />
                Тіркелу
              </router-link>
            </p>
          </div>

          <div class="demo-info">
            <p>🎯 Демо аккаунт:</p>
            <code>admin@gmail.com / admin123</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lucide иконкаларын импорттау
import { 
  Hand, Sparkles, Mic, Smartphone, LogIn, Mail, Lock, 
  Eye, EyeOff, KeyRound, Loader2, Chrome, UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const result = await authStore.login(form.value.email, form.value.password)
  
  if (result.success) {
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', form.value.email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }
    router.push('/')
  } else {
    alert(result.message || 'Email немесе пароль қате')
  }
  loading.value = false
}

const rememberedEmail = localStorage.getItem('rememberedEmail')
if (rememberedEmail) {
  form.value.email = rememberedEmail
  rememberMe.value = true
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
}

.login-container {
  display: flex;
  max-width: 1100px;
  width: 100%;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.08);
}

/* ========== СОЛ ЖАҚ - WELCOME БЛОГЫ ========== */
.welcome-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  color: white;
}

.logo-badge {
  margin-bottom: 24px;
}

.logo-hand {
  stroke: white;
  stroke-width: 1.5;
}

.welcome-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.welcome-text {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 32px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  opacity: 0.9;
}

.feature-icon {
  stroke: white;
  stroke-width: 1.5;
}

/* ========== ОҢ ЖАҚ - ФОРМА БЛОГЫ ========== */
.form-section {
  flex: 1;
  padding: 48px 40px;
  background: white;
}

.form-container {
  max-width: 360px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.header-icon {
  stroke: #6366f1;
  stroke-width: 1.5;
}

.form-container h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  stroke: #94a3b8;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  stroke: #94a3b8;
  stroke-width: 1.5;
}

.input-icon-wrapper input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
  font-family: inherit;
}

.input-icon-wrapper input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-icon-wrapper input:focus + .input-icon {
  stroke: #6366f1;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s;
}

.password-toggle:hover {
  background: #f1f5f9;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #475569;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #6366f1;
}

.forgot-link {
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  margin-top: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  background: white;
  padding: 0 12px;
  position: relative;
  font-size: 12px;
  color: #94a3b8;
}

/* Google батырмасы */
.google-btn {
  width: 100%;
  padding: 12px;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.google-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.google-icon {
  stroke: #475569;
}

/* Тіркелу сілтемесі */
.register-prompt {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef2f6;
}

.register-prompt p {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.register-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.register-link:hover {
  text-decoration: underline;
}

/* Демо ақпарат */
.demo-info {
  margin-top: 20px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 16px;
  text-align: center;
}

.demo-info p {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.demo-info code {
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  color: #6366f1;
  font-family: monospace;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .login-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .welcome-section {
    padding: 32px 28px;
  }
  
  .welcome-section h1 {
    font-size: 26px;
  }
  
  .form-section {
    padding: 36px 28px;
  }
  
  .features {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 12px;
  }
  
  .welcome-section {
    padding: 24px 20px;
  }
  
  .form-section {
    padding: 28px 20px;
  }
  
  .form-container h2 {
    font-size: 24px;
  }
}
</style>