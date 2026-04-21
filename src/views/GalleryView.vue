<template>
  <div class="gallery-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Галерея</h1>
        <p class="page-sub">Моменти з подій нашої спільноти</p>
      </div>

      <div v-if="photos.length" class="gallery-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="gallery-item"
          @click="openPhoto(photo)"
        >
          <div class="gallery-img-wrap">
            <img :src="photo.url" :alt="photo.eventTitle" loading="lazy" />
            <div class="gallery-overlay">
              <p class="gallery-overlay-title">{{ photo.eventTitle }}</p>
              <p class="gallery-overlay-date">{{ formatDate(photo.eventDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="gallery-empty">
        <p>Поки що тут порожньо</p>
        <p class="gallery-empty-sub">Організатори додаватимуть фото після проведення подій</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="modal">
      <div v-if="activePhoto" class="lightbox" @click.self="activePhoto = null">
        <div class="lightbox-box">
          <button class="lightbox-close" @click="activePhoto = null">✕</button>
          <img :src="activePhoto.url" :alt="activePhoto.eventTitle" class="lightbox-img" />
          <div class="lightbox-info">
            <p class="lightbox-title">{{ activePhoto.eventTitle }}</p>
            <p class="lightbox-date">{{ formatDate(activePhoto.eventDate) }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores'

const eventsStore = useEventsStore()
const activePhoto = ref(null)

const photos = computed(() =>
  [...eventsStore.galleryPhotos].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
)

function openPhoto(photo) {
  activePhoto.value = photo
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.gallery-page { padding: 60px 0 80px; }

.page-header { margin-bottom: 48px; }
.page-title { font-family: var(--font-display); font-size: clamp(28px, 5vw, 48px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; }
.page-sub { color: var(--text-muted); font-size: 15px; }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.gallery-item {
  cursor: pointer;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all var(--transition);
}
.gallery-item:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }

.gallery-img-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}
.gallery-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.gallery-item:hover .gallery-img-wrap img { transform: scale(1.05); }

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,15,26,0.9) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity var(--transition);
}
.gallery-item:hover .gallery-overlay { opacity: 1; }

.gallery-overlay-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.gallery-overlay-date { font-size: 12px; color: var(--text-muted); }

.gallery-empty {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}
.gallery-empty-sub { font-size: 14px; margin-top: 8px; }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(13,15,26,0.95);
  backdrop-filter: blur(12px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox-box {
  position: relative;
  max-width: 860px;
  width: 100%;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  color: var(--text-muted);
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition);
  line-height: 1;
}
.lightbox-close:hover { color: var(--text); }

.lightbox-img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  display: block;
}

.lightbox-info {
  padding: 16px 4px 0;
}
.lightbox-title { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.lightbox-date { font-size: 13px; color: var(--text-muted); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
