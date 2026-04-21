<template>
  <div class="detail-page">
    <div v-if="event" class="container">
      <RouterLink to="/events" class="back-link">← Всі події</RouterLink>

      <div class="detail-layout">
        <div class="detail-main">
          <div class="detail-img-wrap">
            <img :src="event.image" :alt="event.title" />
            <span class="tag detail-cat" :class="categoryClass">{{ event.category }}</span>
          </div>

          <!-- Фото з події — видно організатору -->
          <div v-if="isOwner && galleryPhotos.length" class="event-gallery">
            <h3 class="event-gallery-title">Фото з події</h3>
            <div class="event-gallery-grid">
              <div v-for="photo in galleryPhotos" :key="photo.id" class="event-gallery-item">
                <img :src="photo.url" :alt="event.title" />
                <button class="event-gallery-delete" @click="confirmDeletePhoto(photo.id)" title="Видалити фото">✕</button>
              </div>
            </div>
          </div>

          <div class="detail-content">
            <div class="detail-meta">
              <span class="detail-city">{{ event.city }}</span>
              <span class="meta-dot"></span>
              <span>{{ formatDate(event.date) }}</span>
              <span class="meta-dot"></span>
              <span>{{ event.duration }}</span>
            </div>

            <h1 class="detail-title">{{ event.title }}</h1>

            <div class="detail-host">
              <div class="host-avatar">{{ event.host[0] }}</div>
              <div>
                <p class="host-label">Організатор</p>
                <p class="host-name">{{ event.host }}</p>
              </div>
            </div>

            <div class="detail-divider"></div>
            <p class="detail-desc">{{ event.description }}</p>

            <div class="detail-info">
              <div class="info-item">
                <span class="info-label">Місто</span>
                <span class="info-val">{{ event.city }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Тривалість</span>
                <span class="info-val">{{ event.duration }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Учасники</span>
                <span class="info-val">{{ liveParticipants }} / {{ event.maxParticipants }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Адреса</span>
                <span class="info-val info-note">Надсилається на пошту після реєстрації</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="detail-sidebar">
          <div class="join-card">
            <div class="join-spots">
              <div class="spots-bar">
                <div class="spots-fill" :style="{ width: spotsPercent + '%' }" :class="{ 'spots-full': isFull }"></div>
              </div>
              <p class="spots-text">
                <template v-if="isFull">Місця заповнені</template>
                <template v-else>Залишилось {{ spotsLeft }} {{ pluralMist(spotsLeft) }}</template>
              </p>
            </div>

            <div v-if="alreadyJoined" class="joined-msg">Ти вже зареєстрований на цю подію</div>
            <button v-else-if="!isFull" class="btn btn-primary join-btn" @click="showModal = true">Приєднатись</button>
            <button v-else class="btn btn-outline join-btn" disabled>Місця заповнені</button>

            <div class="join-note">Адреса зустрічі надсилається на пошту після підтвердження реєстрації.</div>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="container not-found">
      <p>Подію не знайдено.</p>
      <RouterLink to="/events" class="btn btn-outline" style="margin-top:16px">Назад до подій</RouterLink>
    </div>

    <!-- Join Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box">
          <button class="modal-close" @click="showModal = false">✕</button>
          <h2 class="modal-title">Приєднатись до події</h2>
          <p class="modal-event-name">{{ event?.title }}</p>

          <div v-if="!submitDone" class="modal-form">
            <div class="form-group">
              <label class="form-label">Ім'я</label>
              <input v-model="form.name" class="form-input" :class="{ error: errors.name }" placeholder="Твоє ім'я" />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Телефон</label>
              <input v-model="form.phone" class="form-input" :class="{ error: errors.phone }" placeholder="+380..." />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="form.email" class="form-input" :class="{ error: errors.email }" placeholder="your@email.com" type="email" />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>
            <div v-if="errors.general" class="field-error-box">{{ errors.general }}</div>
            <button class="btn btn-primary join-btn" @click="submitJoin">Надіслати заявку</button>
          </div>

          <div v-else class="modal-success">
            <div class="success-icon">✓</div>
            <p class="success-title">Заявку надіслано!</p>
            <p class="success-sub">Лист з адресою та деталями надійде на <strong>{{ form.email }}</strong></p>
          </div>
        </div>
      </div>
    </Transition>

        <!-- Підтвердження видалення фото -->
    <Transition name="modal">
      <div v-if="photoToDelete" class="modal-overlay" @click.self="photoToDelete = null">
        <div class="modal-box confirm-modal">
          <h2 class="modal-title">Видалити фото?</h2>
          <p class="confirm-text">Фото буде видалено з галереї назавжди.</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="photoToDelete = null">Скасувати</button>
            <button class="btn-danger-confirm" @click="doDeletePhoto">Так, видалити</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore, useEventsStore } from '@/stores'

const route = useRoute()
const eventsStore = useEventsStore()
const auth = useAuthStore()

const event = ref(null)
const showModal = ref(false)
const submitDone = ref(false)
const alreadyJoined = ref(false)
const liveParticipants = ref(0)
const form = ref({ name: '', phone: '', email: '' })
const errors = ref({})
const photoToDelete = ref(null)

onMounted(() => {
  event.value = eventsStore.getById(route.params.id)
  if (event.value) liveParticipants.value = event.value.currentParticipants
  if (auth.isLoggedIn) {
    form.value.name = auth.user.name + (auth.user.lastName ? ' ' + auth.user.lastName : '')
    form.value.email = auth.user.email
    if (event.value) {
      alreadyJoined.value = eventsStore.hasJoined(event.value.id, auth.user.email, '')
    }
  }
})

const galleryPhotos = computed(() => {
  if (!event.value) return []
  return eventsStore.galleryPhotos.filter(p => p.eventId === event.value.id)
})

const isOwner = computed(() =>
  auth.isLoggedIn && event.value && event.value.userId === auth.user?.id
)

function confirmDeletePhoto(photoId) {
  photoToDelete.value = photoId
}

function doDeletePhoto() {
  eventsStore.deleteGalleryPhoto(photoToDelete.value)
  photoToDelete.value = null
}

const CATEGORY_CLASSES = {
  'Культура': 'tag-yellow', 'Спорт': 'tag-lavender', 'Музика': 'tag-pink',
  'Майстерня': 'tag-yellow', 'Навчання': 'tag-lavender', 'Кіно': 'tag-pink', 'Мистецтво': 'tag-yellow'
}
const categoryClass = computed(() => CATEGORY_CLASSES[event.value?.category] || 'tag-lavender')
const spotsLeft = computed(() => Math.max(0, (event.value?.maxParticipants || 0) - liveParticipants.value))
const spotsPercent = computed(() => Math.min(100, Math.round((liveParticipants.value / (event.value?.maxParticipants || 1)) * 100)))
const isFull = computed(() => spotsLeft.value === 0)

function pluralMist(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'місце'
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'місця'
  return 'місць'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
}

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = "Введи ім'я"
  if (!form.value.phone.trim()) errors.value.phone = 'Введи номер телефону'
  if (!form.value.email.trim()) errors.value.email = 'Введи email'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Невірний формат email'
  return !Object.keys(errors.value).length
}

function submitJoin() {
  if (!validate()) return
  const err = eventsStore.joinEvent(event.value.id, { name: form.value.name, phone: form.value.phone, email: form.value.email })
  if (err) { errors.value.general = err; return }
  liveParticipants.value += 1
  alreadyJoined.value = true
  submitDone.value = true
  setTimeout(() => { showModal.value = false; submitDone.value = false }, 3000)
}
</script>

<style scoped>
.detail-page { padding: 40px 0 80px; }
.back-link { display: inline-block; color: var(--text-muted); font-size: 14px; margin-bottom: 32px; transition: color var(--transition); }
.back-link:hover { color: var(--text); }

.detail-layout { display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start; }

.detail-img-wrap { position: relative; border-radius: var(--radius-lg); overflow: hidden; height: 400px; margin-bottom: 32px; }
.detail-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.detail-cat { position: absolute; top: 16px; left: 16px; }

.detail-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }
.detail-city { color: var(--lavender); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.meta-dot { width: 3px; height: 3px; background: var(--text-muted); border-radius: 50%; }

.detail-title { font-family: var(--font-display); font-size: clamp(24px, 4vw, 40px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 28px; }

.detail-host { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.host-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--navy); border: 1px solid var(--lavender); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 16px; color: var(--lavender); }
.host-label { font-size: 12px; color: var(--text-muted); margin-bottom: 2px; }
.host-name { font-size: 15px; font-weight: 500; }

.detail-divider { height: 1px; background: var(--border); margin-bottom: 28px; }
.detail-desc { font-size: 16px; line-height: 1.8; color: var(--text-muted); margin-bottom: 36px; }

.detail-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-item { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; }
.info-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 6px; }
.info-val { font-size: 15px; font-weight: 500; }
.info-note { color: var(--text-muted); font-size: 13px; font-weight: 400; }

.join-card { position: sticky; top: 90px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.spots-bar { height: 4px; background: var(--bg-3); border-radius: 2px; margin-bottom: 8px; overflow: hidden; }
.spots-fill { height: 100%; background: var(--lavender); border-radius: 2px; transition: width 0.5s ease; }
.spots-fill.spots-full { background: #ff6b6b; }
.spots-text { font-size: 13px; color: var(--text-muted); }
.join-btn { width: 100%; justify-content: center; padding: 16px; }
.join-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.join-note { font-size: 12px; color: var(--text-muted); line-height: 1.6; border-top: 1px solid var(--border); padding-top: 16px; }
.joined-msg { background: rgba(168, 163, 246, 0.1); border: 1px solid var(--lavender); border-radius: var(--radius); padding: 14px 18px; font-size: 14px; color: var(--lavender); text-align: center; line-height: 1.5; }

.modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 6px; }
.modal-event-name { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; }
.modal-form { display: flex; flex-direction: column; gap: 16px; }
.modal-form .join-btn { margin-top: 8px; justify-content: center; }
.modal-close { position: absolute; top: 16px; right: 16px; color: var(--text-muted); font-size: 16px; cursor: pointer; background: none; border: none; line-height: 1; transition: color var(--transition); }
.modal-close:hover { color: var(--text); }
.modal-success { text-align: center; padding: 20px 0; }
.success-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(168, 163, 246, 0.15); border: 1px solid var(--lavender); color: var(--lavender); font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 10px; }
.success-sub { color: var(--text-muted); font-size: 14px; line-height: 1.6; }

.event-gallery { margin-top: 32px; }
.event-gallery-title { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.event-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.event-gallery-item { position: relative; border-radius: var(--radius); overflow: hidden; aspect-ratio: 1; }
.event-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.event-gallery-delete {
  position: absolute;
  top: 6px; right: 6px;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(13,15,26,0.8);
  border: none;
  color: #ff6b6b;
  font-size: 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}
.event-gallery-item:hover .event-gallery-delete { opacity: 1; }

.confirm-modal { max-width: 420px; }
.confirm-text { color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
.confirm-actions { display: flex; gap: 12px; justify-content: flex-end; }
.btn-danger-confirm { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); color: #ff6b6b; padding: 11px 20px; border-radius: var(--radius); font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-body); transition: all var(--transition); }
.btn-danger-confirm:hover { background: rgba(255,107,107,0.2); }

.field-error-box { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: var(--radius); padding: 12px 16px; font-size: 13px; color: #ff6b6b; }
.not-found { padding: 80px 0; text-align: center; color: var(--text-muted); }

@media (max-width: 900px) { .detail-layout { grid-template-columns: 1fr; } .join-card { position: static; } .detail-info { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .detail-info { grid-template-columns: 1fr; } }
</style>
