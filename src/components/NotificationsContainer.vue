<template>
  <div class="notifications-container">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
      >
        <div class="notification-content">
          <span class="notification-icon">
            <CheckCircle v-if="notification.type === 'success'" :size="20" />
            <AlertCircle v-else-if="notification.type === 'error'" :size="20" />
            <InfoIcon v-else-if="notification.type === 'info'" :size="20" />
            <AlertTriangle v-else :size="20" />
          </span>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button
          class="notification-close"
          @click="removeNotification(notification.id)"
        >
          <X :size="18" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationsStore } from '../stores/notifications'
import { CheckCircle, AlertCircle, Info as InfoIcon, AlertTriangle, X } from 'lucide-vue-next'

const notificationsStore = useNotificationsStore()
const notifications = computed(() => notificationsStore.notifications)

const removeNotification = (id) => {
  notificationsStore.removeNotification(id)
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.notification-message {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 4px;
}

.notification-close:hover {
  opacity: 1;
}

/* Типы уведомлений */
.notification-success {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Тёмный режим */
:root.dark-theme .notification {
  background: #2a2a3e;
  color: #e8e8f0;
}

:root.dark-theme .notification-message {
  color: #e8e8f0;
}

:root.dark-theme .notification-success {
  background: rgba(16, 185, 129, 0.1);
}

:root.dark-theme .notification-error {
  background: rgba(239, 68, 68, 0.1);
}

:root.dark-theme .notification-warning {
  background: rgba(245, 158, 11, 0.1);
}

:root.dark-theme .notification-info {
  background: rgba(59, 130, 246, 0.1);
}
</style>
