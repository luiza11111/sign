<template>
  <div class="register-wrapper">
    <div class="register-container">
      <!-- Сол жақ - Welcome блогы -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="logo-badge">
            <UserPlus class="logo-icon" :size="56" :stroke-width="1.5" />
          </div>
          <h1>Тіркеліңіз!</h1>
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
            <UserPlus class="header-icon" :size="28" />
            <h2>Тіркелу</h2>
          </div>
          
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="input-group">
              <label>
                <User class="label-icon" :size="14" />
                Аты-жөні
              </label>
              <div class="input-icon-wrapper">
                <User class="input-icon" :size="18" />
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Аты-жөніңіз"
                />
              </div>
            </div>

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
                  minlength="6"
                  placeholder="Кемінде 6 символ"
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
              <div class="password-strength" v-if="form.password.length > 0">
                <div class="strength-bar">
                  <div :class="['strength-fill', strengthClass]"></div>
                </div>
                <div class="strength-text">
                  <ShieldCheck v-if="strengthClass === 'strong'" :size="12" />
                  <ShieldAlert v-else-if="strengthClass === 'medium'" :size="12" />
                  <ShieldX v-else :size="12" />
                  <span>{{ strengthText }}</span>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label>
                <Lock class="label-icon" :size="14" />
                Парольді қайталаңыз
              </label>
              <div class="input-icon-wrapper password-wrapper">
                <Lock class="input-icon" :size="18" />
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Парольді қайта енгізіңіз"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
              <div v-if="confirmPassword && form.password !== confirmPassword" class="error-message">
                <AlertCircle :size="12" />
                <span>Парольдер сәйкес келмейді</span>
              </div>
              <div v-else-if="confirmPassword && form.password === confirmPassword && form.password.length >= 6" class="success-message">
                <CheckCircle :size="12" />
                <span>Парольдер сәйкес келеді</span>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" required>
                <span>Пайдалану шарттарын оқып, қабылдаймын</span>
              </label>
            </div>

            <button type="submit" :disabled="loading || !isFormValid" class="register-btn">
              <UserPlus v-if="!loading" :size="18" />
              <Loader2 v-else class="spinner-icon" :size="18" />
              <span>{{ loading ? 'Тіркелуде...' : 'Тіркелу' }}</span>
            </button>
          </form>

          <div class="divider">
            <span>немесе</span>
          </div>

          <button class="google-btn">
            <Chrome class="google-icon" :size="18" />
            Google арқылы тіркелу
          </button>

          <div class="login-prompt">
            <p>Аккаунтыңыз бар ма? 
              <router-link to="/login" class="login-link">
                <LogIn :size="14" />
                Кіру
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lucide иконкаларын импорттау
import { 
  UserPlus, Sparkles, Mic, Smartphone, User, Mail, Lock,
  Eye, EyeOff, ShieldCheck, ShieldAlert, ShieldX, AlertCircle,
  CheckCircle, Loader2, Chrome, LogIn
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: ''
})

const confirmPassword = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

// Пароль күшін тексеру
const strengthClass = computed(() => {
  const pass = form.value.password
  if (!pass) return ''
  if (pass.length < 6) return 'weak'
  if (pass.length < 8) return 'medium'
  return 'strong'
})

const strengthText = computed(() => {
  const pass = form.value.password
  if (!pass) return ''
  if (pass.length < 6) return 'Әлсіз пароль'
  if (pass.length < 8) return 'Орташа пароль'
  return 'Күшті пароль'
})

// Форманың дұрыстығын тексеру
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password.length >= 6 &&
         form.value.password === confirmPassword.value &&
         agreeTerms.value
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const result = await authStore.register(form.value.name, form.value.email, form.value.password)
  
  if (result.success) {
    alert(result.message)
    router.push('/login')
  } else {
    alert(result.message)
  }
  loading.value = false
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
}

.register-container {
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

.logo-icon {
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
  padding: 40px 40px;
  background: white;
}

.form-container {
  max-width: 380px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  padding: 12px 16px 12px 44px;
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

/* Пароль күші */
.password-strength {
  margin-top: 6px;
}

.strength-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.weak {
  width: 33%;
  background: #ef4444;
}

.strength-fill.medium {
  width: 66%;
  background: #f59e0b;
}

.strength-fill.strong {
  width: 100%;
  background: #10b981;
}

.strength-text {
  font-size: 10px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message {
  font-size: 11px;
  color: #ef4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.success-message {
  font-size: 11px;
  color: #10b981;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-options {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #475569;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #6366f1;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

.register-btn:disabled {
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

/* Кіру сілтемесі */
.login-prompt {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef2f6;
}

.login-prompt p {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.login-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.login-link:hover {
  text-decoration: underline;
}

/* ========== МОБИЛЬДІ ========== */
@media (max-width: 900px) {
  .register-container {
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
    padding: 32px 28px;
  }
  
  .features {
    display: none;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
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