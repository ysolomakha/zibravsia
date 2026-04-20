<template>
  <div class="events-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Події</h1>
        <p class="page-sub">{{ countLabel }}</p>
      </div>

      <div class="filters">
        <div class="search-wrap">
          <input v-model="query" class="form-input" placeholder="Пошук за назвою..." />
        </div>
        <div class="filter-row">
          <select v-model="selectedCity" class="form-input filter-select">
            <option v-for="c in eventsStore.CITIES" :key="c">{{ c }}</option>
          </select>
          <select v-model="selectedCategory" class="form-input filter-select">
            <option v-for="c in eventsStore.CATEGORIES" :key="c">{{ c }}</option>
          </select>
          <select v-model="sortBy" class="form-input filter-select">
            <option value="date-asc">Дата: найближчі</option>
            <option value="date-desc">Дата: найдальші</option>
            <option value="spots">Найбільше місць</option>
            <option value="duration">Тривалість</option>
          </select>
          <button v-if="hasFilters" class="btn btn-ghost" @click="resetFilters">Скинути</button>
        </div>
      </div>

      <div v-if="sorted.length" class="events-grid">
        <EventCard v-for="event in sorted" :key="event.id" :event="event" />
      </div>
      <div v-else class="empty">
        <p class="empty-text">Подій не знайдено</p>
        <button class="btn btn-outline" @click="resetFilters">Скинути фільтри</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '@/stores'
import EventCard from '@/components/EventCard.vue'

const route = useRoute()
const eventsStore = useEventsStore()

const query = ref('')
const selectedCity = ref('Всі міста')
const selectedCategory = ref('Всі категорії')
const sortBy = ref('date-asc')

onMounted(() => { if (route.query.q) query.value = route.query.q })

const hasFilters = computed(() =>
  query.value || selectedCity.value !== 'Всі міста' || selectedCategory.value !== 'Всі категорії'
)

const filtered = computed(() =>
  eventsStore.getAll().filter(e => {
    const matchQ = !query.value || e.title.toLowerCase().includes(query.value.toLowerCase())
    const matchCity = selectedCity.value === 'Всі міста' || e.city === selectedCity.value
    const matchCat = selectedCategory.value === 'Всі категорії' || e.category === selectedCategory.value
    return matchQ && matchCity && matchCat
  })
)

const DURATION_ORDER = ['30 хв', '1 год', '1 год 30 хв', '2 год', '2 год 30 хв', '3 год', '4 год', '5 год', 'Весь день']

const sorted = computed(() => {
  let list = [...filtered.value]
  if (sortBy.value === 'date-asc') list.sort((a, b) => new Date(a.date) - new Date(b.date))
  else if (sortBy.value === 'date-desc') list.sort((a, b) => new Date(b.date) - new Date(a.date))
  else if (sortBy.value === 'spots') list.sort((a, b) => (b.maxParticipants - b.currentParticipants) - (a.maxParticipants - a.currentParticipants))
  else if (sortBy.value === 'duration') list.sort((a, b) => DURATION_ORDER.indexOf(a.duration) - DURATION_ORDER.indexOf(b.duration))
  return list
})

// Smart label
const countLabel = computed(() => {
  const n = sorted.value.length
  const word = n % 10 === 1 && n % 100 !== 11 ? 'подія'
    : [2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100) ? 'події' : 'подій'

  if (selectedCity.value !== 'Всі міста' && selectedCategory.value === 'Всі категорії') {
    return `${n} ${word} у місті ${selectedCity.value}`
  }
  if (selectedCategory.value !== 'Всі категорії' && selectedCity.value === 'Всі міста') {
    return `${n} ${word} у категорії ${selectedCategory.value}`
  }
  if (selectedCity.value !== 'Всі міста' && selectedCategory.value !== 'Всі категорії') {
    return `${n} ${word} · ${selectedCity.value} · ${selectedCategory.value}`
  }
  return `${n} ${word} по всій Україні`
})

function resetFilters() {
  query.value = ''
  selectedCity.value = 'Всі міста'
  selectedCategory.value = 'Всі категорії'
}
</script>

<style scoped>
.events-page { padding: 60px 0; }
.page-header { margin-bottom: 40px; }
.page-title { font-family: var(--font-display); font-size: clamp(28px, 5vw, 48px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; }
.page-sub { color: var(--text-muted); font-size: 15px; }
.filters { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
.search-wrap input { max-width: 480px; }
.filter-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.filter-select { width: auto; min-width: 160px; cursor: pointer; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.empty { text-align: center; padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.empty-text { color: var(--text-muted); font-size: 16px; }
@media (max-width: 640px) { .filter-select { min-width: 140px; } }
</style>
