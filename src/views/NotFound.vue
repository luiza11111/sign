<template>
  <div class="not-found-wrapper">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-icon">🔍</div>
        <h1>404</h1>
        <h2>Бет табылмады</h2>
        <p>Кешіріңіз, сіз іздеген бет жоқ немесе жылжытылған.</p>
        <div class="button-group">
          <router-link to="/" class="home-btn">
            🏠 Басты бетке
          </router-link>
          <button @click="goBack" class="back-btn">
            ◀ Артқа қайту
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  padding: 20px;
}

.not-found-container {
  max-width: 500px;
  width: 100%;
}

.not-found-content {
  background: white;
  border-radius: 32px;
  padding: 48px 32px;
  text-align: center;
  border: 1px solid #eef2f6;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h1 {
  font-size: 80px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 12px;
}

p {
  color: #64748b;
  margin-bottom: 32px;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.home-btn, .back-btn {
  padding: 12px 24px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.home-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.4);
}

.back-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.back-btn:hover {
  background: #e2e8f0;
}
</style>