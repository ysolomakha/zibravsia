<template>
  <RouterLink :to="`/events/${event.id}`" class="event-card">
    <div class="card-img-wrap">
      <img :src="event.image" :alt="event.title" loading="lazy" />
      <span v-if="status === 'ongoing'" class="card-ongoing">Зараз відбувається</span>
      <span class="card-category tag" :class="categoryClass">{{ event.category }}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-city">{{ event.city }}</span>
        <span class="card-dot"></span>
        <span class="card-date">{{ formatDate(event.date) }}</span>
      </div>
      <h3 class="card-title">{{ event.title }}</h3>
      <div class="card-footer">
        <span class="card-host">{{ event.host }}</span>
        <span class="card-duration">{{ event.duration }}</span>
      </div>
    </div>
    <div class="card-hover-overlay">
      <span class="card-cta">Дізнатись більше</span>
    </div>
  </RouterLink>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true }
})

const CATEGORY_CLASSES = {
  'Культура': 'tag-yellow',
  'Спорт': 'tag-lavender',
  'Музика': 'tag-pink',
  'Майстерня': 'tag-yellow',
  'Навчання': 'tag-lavender',
  'Кіно': 'tag-pink',
  'Мистецтво': 'tag-yellow',
}

const categoryClass = CATEGORY_CLASSES[props.event.category] || 'tag-lavender'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

import { getEventStatus } from '@/stores'
import { computed } from 'vue'

const status = computed(() => getEventStatus(props.event))
</script>

<style scoped>
.event-card {
  position: relative;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
  display: block;
  cursor: pointer;
}

.card-ongoing {
  position: absolute;
  bottom: 14px;
  left: 14px;
  background: var(--yellow);
  color: var(--bg);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
}

.event-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
}

.card-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card:hover .card-img-wrap img {
  transform: scale(1.05);
}

.card-category {
  position: absolute;
  top: 14px;
  left: 14px;
}

.card-body {
  padding: 20px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.card-city {
  font-size: 13px;
  font-weight: 600;
  color: var(--lavender);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.card-dot {
  width: 3px;
  height: 3px;
  background: var(--text-muted);
  border-radius: 50%;
}

.card-date {
  font-size: 13px;
  color: var(--text-muted);
}

.card-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 16px;
  color: var(--text);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-host {
  font-size: 13px;
  color: var(--text-muted);
}

.card-duration {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-3);
  padding: 4px 10px;
  border-radius: 100px;
}

.card-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(36, 49, 107, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}

.event-card:hover .card-hover-overlay {
  opacity: 1;
}

.card-cta {
  background: var(--yellow);
  color: var(--bg);
  padding: 12px 28px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
}
</style>
