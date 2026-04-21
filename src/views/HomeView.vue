<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
      </div>
      <div class="container hero-inner">
        <p class="hero-label">для тих, хто шукає двіж</p>
        <h1 class="hero-title">Знайди своїх<br /><span class="accent">однодумців</span></h1>
        <p class="hero-sub">Чайні церемонії, йога, кіно під зорями, свічки, музика — події по всій Україні від людей як ти.</p>
        <div class="hero-actions">
          <RouterLink to="/events" class="btn btn-primary hero-btn">Переглянути події</RouterLink>
          <RouterLink to="/auth" class="btn btn-outline">Створити подію</RouterLink>
        </div>
        <div class="hero-search">
          <input v-model="searchQuery" class="form-input search-input" placeholder="Пошук за назвою або містом..." @keyup.enter="goSearch" />
          <button class="btn btn-primary search-btn" @click="goSearch">Знайти</button>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container stats-inner">
        <div class="stat">
          <span class="stat-num">{{ totalEvents }}</span>
          <span class="stat-label">активних подій</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">5</span>
          <span class="stat-label">міст</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-num">7</span>
          <span class="stat-label">категорій</span>
        </div>
      </div>
    </section>

    <section class="featured">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Найближчі події</h2>
          <RouterLink to="/events" class="btn btn-ghost">Всі події →</RouterLink>
        </div>
        <div class="events-grid">
          <EventCard v-for="event in featuredEvents" :key="event.id" :event="event" />
        </div>
      </div>
    </section>

    <section v-if="galleryPhotos.length" class="gallery-preview">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">З наших зустрічей</h2>
          <RouterLink to="/gallery" class="btn btn-ghost">Вся галерея →</RouterLink>
        </div>
        <div class="gallery-scroll">
          <div
            v-for="photo in galleryPhotos"
            :key="photo.id"
            class="gallery-scroll-item"
          >
            <img :src="photo.url" :alt="photo.eventTitle" />
            <div class="gallery-scroll-info">
              <p class="gallery-scroll-title">{{ photo.eventTitle }}</p>
              <p class="gallery-scroll-date">{{ formatGalleryDate(photo.eventDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <div class="cta-orb"></div>
          <h2 class="cta-title">Маєш ідею для зустрічі?</h2>
          <p class="cta-sub">Зареєструйся і створи власну подію — ми допоможемо зібрати компанію.</p>
          <RouterLink to="/auth" class="btn btn-primary">Почати</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores'
import EventCard from '@/components/EventCard.vue'
import { getEventStatus } from '@/stores'

const router = useRouter()
const eventsStore = useEventsStore()
const searchQuery = ref('')

// getAll already sorts by date asc — take first 4 (nearest)
const allEvents = computed(() => eventsStore.getAll())
const featuredEvents = computed(() => allEvents.value.slice(0, 4))
const galleryPhotos = computed(() =>
  [...eventsStore.galleryPhotos]
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, 10)
)
function formatGalleryDate(d) {
  return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
}

const totalEvents = computed(() =>
  allEvents.value.filter(e => getEventStatus(e) === 'active').length
)

function goSearch() {
  router.push(searchQuery.value.trim() ? { path: '/events', query: { q: searchQuery.value.trim() } } : '/events')
}
</script>

<style scoped>
.hero { position: relative; overflow: hidden; padding: 100px 0 80px; min-height: 600px; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; }
.orb-1 { width: 500px; height: 500px; background: var(--lavender); top: -200px; right: -100px; }
.orb-2 { width: 350px; height: 350px; background: var(--yellow); bottom: -100px; left: -80px; opacity: 0.1; }
.orb-3 { width: 250px; height: 250px; background: var(--pink); top: 50%; left: 40%; opacity: 0.08; }
.hero-inner { position: relative; max-width: 720px; }
.hero-label { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lavender); margin-bottom: 20px; font-weight: 500; }
.hero-title { font-family: var(--font-display); font-size: clamp(40px, 7vw, 72px); font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 24px; }
.accent { color: var(--yellow); }
.hero-sub { font-size: 18px; color: var(--text-muted); line-height: 1.7; max-width: 520px; margin-bottom: 40px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.hero-btn { padding: 16px 36px; font-size: 15px; }
.hero-search { display: flex; gap: 12px; max-width: 500px; }
.search-input { flex: 1; background: rgba(255,255,255,0.05); }
.search-btn { white-space: nowrap; }

.stats { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 32px 0; margin-bottom: 80px; }
.stats-inner { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-num { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--yellow); }
.stat-label { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-divider { width: 1px; height: 40px; background: var(--border); }

.featured { margin-bottom: 80px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.section-title { font-family: var(--font-display); font-size: 26px; font-weight: 600; letter-spacing: -0.02em; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

.cta-box { position: relative; overflow: hidden; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 64px 48px; text-align: center; }
.cta-orb { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: var(--navy); filter: blur(60px); opacity: 0.6; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.cta-title { position: relative; font-family: var(--font-display); font-size: clamp(24px, 4vw, 36px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; }
.cta-sub { position: relative; color: var(--text-muted); font-size: 16px; max-width: 400px; margin: 0 auto 32px; line-height: 1.7; }
.cta-box .btn { position: relative; padding: 16px 40px; font-size: 15px; }

.gallery-preview { margin-bottom: 80px; }

.gallery-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--navy) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 4px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: var(--navy); border-radius: 2px; }

.gallery-scroll-item {
  flex-shrink: 0;
  width: 240px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-2);
}

.gallery-scroll-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.gallery-scroll-info {
  padding: 12px 14px;
}

.gallery-scroll-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery-scroll-date {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .hero { padding: 60px 0 50px; }
  .hero-search { flex-direction: column; }
  .stat-divider { display: none; }
  .cta-box { padding: 40px 24px; }
}
</style>
