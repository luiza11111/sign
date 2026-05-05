<template>
  <div class="sign-video-container">
    <h2>Белгіленген видеолар</h2>
    
    <!-- Сөз іздеу -->
    <div class="search-box">
      <input 
        v-model="searchWord" 
        type="text" 
        placeholder="Сөзді қазақша немесе орысша түрінде теріңіз..."
        @keyup.enter="searchVideo"
      />
      <button @click="searchVideo">Іздеу</button>
    </div>

    <!-- Ағымды видео -->
    <div v-if="currentVideo" class="video-section">
      <h3>{{ currentVideo.kazakh }} ({{ currentVideo.russian }})</h3>
      <div class="video-list">
        <div v-for="(video, index) in currentVideo.links" :key="index" class="video-item">
          <video controls width="320" height="240">
            <source :src="video" type="video/mp4"/>
            Браузер видеоны ойнатуды қолдамайды
          </video>
          <a :href="video" target="_blank" class="video-link">{{ video }}</a>
        </div>
      </div>
    </div>

    <!-- Барлық видеолар -->
    <div v-if="allVideos.length > 0" class="all-videos-section">
      <h3>Барлық сөздер</h3>
      <div class="video-grid">
        <div 
          v-for="item in allVideos" 
          :key="item.kazakh" 
          class="video-card"
          @click="selectVideo(item)"
        >
          <h4>{{ item.kazakh }}</h4>
          <p class="russian-text">{{ item.russian }}</p>
          <p v-if="item.count > 0" class="video-count">📹 {{ item.count }} видео</p>
          <p v-else class="no-video">Видео жоқ</p>
        </div>
      </div>
    </div>

    <!-- Қате сообщеніс -->
    <div v-if="error" class="error">
      ⚠️ {{ error }}
    </div>

    <!-- Жүктеме индикаторы -->
    <div v-if="loading" class="loading">
      ⏳ Жүктеліуде...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'SignVideos',
  setup() {
    const searchWord = ref('');
    const currentVideo = ref(null);
    const allVideos = ref([]);
    const error = ref('');
    const loading = ref(false);

    // Барлық видеоларды іздеу
    const fetchAllVideos = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await fetch('/api/sign-videos');
        if (!response.ok) throw new Error('Видео табылмады');
        allVideos.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    // Сөзбен іздеу
    const searchVideo = async () => {
      if (!searchWord.value.trim()) {
        error.value = 'Сөзді теріңіз';
        return;
      }

      loading.value = true;
      error.value = '';
      try {
        const response = await fetch(`/api/sign-videos/${encodeURIComponent(searchWord.value)}`);
        if (!response.ok) throw new Error('Сөз табылмады');
        currentVideo.value = await response.json();
      } catch (err) {
        error.value = err.message;
        currentVideo.value = null;
      } finally {
        loading.value = false;
      }
    };

    // Картасынан сөзді таңдау
    const selectVideo = (video) => {
      currentVideo.value = video;
      searchWord.value = video.kazakh;
    };

    // Компонент жүктелгенде видеоларды алу
    onMounted(() => {
      fetchAllVideos();
    });

    return {
      searchWord,
      currentVideo,
      allVideos,
      error,
      loading,
      searchVideo,
      selectVideo,
      fetchAllVideos
    };
  }
};
</script>

<style scoped>
.sign-video-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.search-box input {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  width: 300px;
  font-size: 14px;
}

.search-box button {
  padding: 10px 30px;
  background: #5e72e4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.search-box button:hover {
  background: #4c63d2;
}

.video-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.video-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.video-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.video-item video {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.video-link {
  display: block;
  font-size: 12px;
  color: #5e72e4;
  text-decoration: none;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-link:hover {
  text-decoration: underline;
}

.all-videos-section {
  margin-top: 30px;
}

.all-videos-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.video-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #5e72e4;
}

.video-card h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.russian-text {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.video-count {
  color: #5e72e4;
  font-weight: bold;
  margin: 10px 0 0 0;
}

.no-video {
  color: #999;
  margin: 10px 0 0 0;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  border: 1px solid #f5c6cb;
}

.loading {
  text-align: center;
  color: #5e72e4;
  font-size: 16px;
  padding: 20px;
}
</style>
