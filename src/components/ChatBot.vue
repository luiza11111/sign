<template>
  <div class="chat-bot">
    <!-- Бот батырмасы -->
    <button class="bot-btn" @click="toggleChat" :class="{ active: isOpen }">
      <div class="bot-icon">
        <Bot :size="24" v-if="!isThinking" />
        <Loader2 :size="24" class="spin" v-else />
      </div>
      <span class="bot-status"></span>
    </button>

    <!-- Чат терезесі -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <div class="bot-info">
          <div class="bot-avatar">
            <Bot :size="20" />
          </div>
          <div>
            <h4>SignFlow AI</h4>
            <p>Grok AI</p>
          </div>
        </div>
        <button class="close-chat" @click="toggleChat">
          <X :size="18" />
        </button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="message"
          :class="msg.sender"
        >
          <div class="message-content">
            <span class="message-text">{{ msg.text }}</span>
            <span class="message-time">{{ msg.time }}</span>
          </div>
        </div>
        <!-- AI ойлап жатқанда -->
        <div v-if="isThinking" class="message bot">
          <div class="message-content thinking">
            <span class="dot">●</span>
            <span class="dot">●</span>
            <span class="dot">●</span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          :placeholder="'Сұрағыңызды жазыңыз...'"
          type="text"
          :disabled="isThinking"
        />
        <button @click="sendMessage" :disabled="!userInput.trim() || isThinking">
          <Send :size="18" />
        </button>
      </div>
      
      <div class="chat-footer">
        <span>⚡ Grok AI</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Bot, X, Send, Loader2 } from 'lucide-vue-next'
import { getGrokResponse } from '../services/grok'

const isOpen = ref(false)
const isThinking = ref(false)
const userInput = ref('')
const messagesContainer = ref(null)

// Бастапқы хабарлар
const messages = ref([
  {
    text: 'Сәлем! Мен SignFlow AI көмекшісімін. Мен Grok AI технологиясымен жұмыс істеймін. Сізге қалай көмектесе аламын? 🤟',
    sender: 'bot',
    time: getCurrentTime()
  }
])

function getCurrentTime() {
  return new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
}

async function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || isThinking.value) return
  
  const question = userInput.value.trim()
  
  // Пайдаланушының хабарламасын қосу
  messages.value.push({
    text: question,
    sender: 'user',
    time: getCurrentTime()
  })
  
  userInput.value = ''
  await scrollToBottom()
  
  // AI жауабын алу
  isThinking.value = true
  await scrollToBottom()
  
  try {
    const response = await getGrokResponse(question)
    
    messages.value.push({
      text: response,
      sender: 'bot',
      time: getCurrentTime()
    })
  } catch (error) {
    console.error('AI қатесі:', error)
    messages.value.push({
      text: 'Қате орын алды. Қайталап көріңіз.',
      sender: 'bot',
      time: getCurrentTime()
    })
  } finally {
    isThinking.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.chat-bot {
  position: fixed;
  bottom: 100px;
  right: 28px;
  z-index: 1000;
}

.bot-btn {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.bot-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.5);
}

.bot-btn.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.bot-icon {
  color: white;
}

.spin {
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

.bot-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  background-color: #10b981;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  height: 500px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.bot-info p {
  font-size: 10px;
  opacity: 0.8;
  margin: 0;
}

.close-chat {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.2s;
}

.close-chat:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.message {
  display: flex;
}

.message.bot {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
}

.message.bot .message-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-text {
  font-size: 13px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.6;
  display: block;
  margin-top: 4px;
}

.message.user .message-time {
  text-align: right;
}

.thinking {
  background: white !important;
  display: flex;
  gap: 6px;
  padding: 12px 16px;
}

.dot {
  font-size: 20px;
  animation: blink 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

.chat-input {
  display: flex;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eef2f6;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.chat-input input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.chat-input input:disabled {
  background: #f1f5f9;
}

.chat-input button {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.chat-input button:hover:not(:disabled) {
  transform: scale(1.05);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-footer {
  padding: 8px 12px;
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  border-top: 1px solid #eef2f6;
  background: white;
}

/* Қараңғы режим */
:root.dark-theme .chat-window {
  background: #1e293b;
}

:root.dark-theme .chat-messages {
  background: #0f172a;
}

:root.dark-theme .message.bot .message-content {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

:root.dark-theme .chat-input {
  background: #1e293b;
  border-color: #334155;
}

:root.dark-theme .chat-input input {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

:root.dark-theme .chat-input input::placeholder {
  color: #94a3b8;
}

:root.dark-theme .chat-footer {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

:root.dark-theme .thinking {
  background: #1e293b !important;
}

/* Мобильді */
@media (max-width: 500px) {
  .chat-bot {
    bottom: 80px;
    right: 16px;
  }
  
  .chat-window {
    width: 320px;
    height: 450px;
    right: -10px;
  }
}
</style>