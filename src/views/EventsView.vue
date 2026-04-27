<template>
  <div class="events-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Події</h1>
        <p class="page-sub">{{ countLabel }}</p>
      </div>

      <div class="filters">
        <div class="search-wrap">
          <input v-model="query" class="form-input" placeholder="Пошук за назвою..." @input="applyFilters" />
        </div>
        <div class="filter-row">
          <select v-model="selectedCity" class="form-input filter-select" @change="applyFilters">
            <option v-for="c in eventsStore.CITIES" :key="c">{{ c }}</option>
          </select>
          <select v-model="selectedCategory" class="form-input filter-select" @change="applyFilters">
            <option v-for="c in eventsStore.CATEGORIES" :key="c">{{ c }}</option>
          </select>
          <select v-model="sortBy" class="form-input filter-select" @change="applyFilters">
            <option value="date-asc">Дата: найближчі</option>
            <option value="date-desc">Дата: найдальші</option>
            <option value="spots">Найбільше місць</option>
            <option value="duration">Тривалість</option>
          </select>
          <button v-if="hasFilters" class="btn btn-ghost" @click="resetFilters">Скинути</button>
        </div>
      </div>

      <div v-if="eventsStore.loading" class="loading-wrap">
        <p class="loading-text">Завантаження...</p>
      </div>
      <div v-else-if="eventsStore.filteredEvents.length" class="events-grid">
        <EventCard v-for="event in eventsStore.filteredEvents" :key="event.id" :event="event" />
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


async function applyFilters() {
  await eventsStore.fetchFilteredEvents({
    city: selectedCity.value,
    category: selectedCategory.value,
    sortBy: sortBy.value,
    query: query.value
  })
}

onMounted(async () => {
  if (route.query.q) query.value = route.query.q
  await applyFilters()
})

const hasFilters = computed(() =>
  query.value || selectedCity.value !== 'Всі міста' || selectedCategory.value !== 'Всі категорії'
)

async function resetFilters() {
  query.value = ''
  selectedCity.value = 'Всі міста'
  selectedCategory.value = 'Всі категорії'
  sortBy.value = 'date-asc'
  await applyFilters()
}

const countLabel = computed(() => {
  const n = eventsStore.filteredEvents.length
  const word = n % 10 === 1 && n % 100 !== 11 ? 'подія'
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'події' : 'подій'

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
.loading-wrap { text-align: center; padding: 80px 0; }
.loading-text { color: var(--text-muted); font-size: 16px; }
@media (max-width: 640px) { .filter-select { min-width: 140px; } }
</style>