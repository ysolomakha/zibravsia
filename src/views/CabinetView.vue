<template>
  <div class="cabinet-page">
    <div class="container">

      <div class="cabinet-header">
        <div>
          <p class="cabinet-greeting">Привіт,</p>
          <h1 class="cabinet-name">{{ auth.user.name }} {{ auth.user.lastName }}</h1>
          <p class="cabinet-email">{{ auth.user.email }}</p>
        </div>
        <div class="cabinet-header-actions">
          <button class="btn btn-ghost" @click="openEditModal">Редагувати профіль</button>
          <button class="btn btn-outline" @click="showCreateModal = true">+ Нова подія</button>
        </div>
      </div>

      <div class="cabinet-section">
        <h2 class="section-title">
          Мої події
          <span class="events-count">{{ myEvents.length }}</span>
        </h2>

        <TransitionGroup name="list" tag="div" class="events-list">
          <div v-for="event in myEvents" :key="event.id" class="my-event-card">
            <div class="my-event-img">
              <img :src="event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=60'" :alt="event.title" />
            </div>
            <div class="my-event-body">
              <div class="my-event-meta">
                <span class="tag tag-lavender">{{ event.category }}</span>
                <span class="my-event-city">{{ event.city }}</span>
              </div>
              <h3 class="my-event-title">{{ event.title }}</h3>
              <p class="my-event-date">{{ formatDate(event.date) }} · {{ event.duration }}</p>
            </div>
            <div class="my-event-actions">
              <RouterLink :to="`/events/${event.id}`" class="btn btn-ghost">Переглянути</RouterLink>
              <button
                v-if="isPast(event.date)"
                class="btn-add-photo"
                @click="openAddPhoto(event)"
              >+ Фото</button>
              <button class="btn-delete" @click="confirmDelete(event)">Видалити</button>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="myEvents.length === 0" class="cabinet-empty">
          <p>У тебе ще немає подій</p>
          <button class="btn btn-primary" @click="showCreateModal = true">Створити першу</button>
        </div>
      </div>

      <div class="delete-account-row">
        <button class="btn-delete-account" @click="showDeleteAccountModal = true">Видалити акаунт</button>
      </div>

    </div>

    <!-- ── Create Event Modal ── -->
    <Transition name="modal">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreate">
        <div class="modal-box create-modal">
          <button class="modal-close" @click="closeCreate">✕</button>
          <h2 class="modal-title">Нова подія</h2>

          <div v-if="!createDone" class="create-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Назва</label>
                <input v-model="newEvent.title" class="form-input" :class="{ error: newErrors.title }" placeholder="Назва події" />
                <span v-if="newErrors.title" class="form-error">{{ newErrors.title }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Місто</label>
                <select v-model="newEvent.city" class="form-input" :class="{ error: newErrors.city }">
                  <option value="">Обери місто</option>
                  <option v-for="c in eventsStore.CITIES.slice(1)" :key="c">{{ c }}</option>
                </select>
                <span v-if="newErrors.city" class="form-error">{{ newErrors.city }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Категорія</label>
                <select v-model="newEvent.category" class="form-input">
                  <option v-for="c in eventsStore.CATEGORIES.slice(1)" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Тривалість</label>
                <div class="duration-picker">
                  <div class="duration-field">
                    <input v-model.number="durationHours" type="number" min="0" max="23" class="form-input duration-num" placeholder="0" />
                    <span class="duration-unit">год</span>
                  </div>
                  <div class="duration-field">
                    <input v-model.number="durationMinutes" type="number" min="0" max="59" step="5" class="form-input duration-num" placeholder="0" />
                    <span class="duration-unit">хв</span>
                  </div>
                </div>
                <span v-if="newErrors.duration" class="form-error">{{ newErrors.duration }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Дата та час</label>
                <input v-model="newEvent.date" class="form-input" :class="{ error: newErrors.date }" type="datetime-local" />
                <span v-if="newErrors.date" class="form-error">{{ newErrors.date }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Макс. учасників</label>
                <input v-model.number="newEvent.maxParticipants" class="form-input" type="number" min="2" max="100" placeholder="10" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Опис</label>
              <textarea v-model="newEvent.description" class="form-input" :class="{ error: newErrors.description }" rows="4" placeholder="Розкажи про подію..."></textarea>
              <span v-if="newErrors.description" class="form-error">{{ newErrors.description }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">URL фото (необов'язково)</label>
              <input v-model="newEvent.image" class="form-input" placeholder="https://..." />
            </div>

            <button class="btn btn-primary create-btn" @click="submitCreate">Опублікувати подію</button>
          </div>

          <div v-else class="modal-success">
            <div class="success-icon">✓</div>
            <p class="success-title">Подію створено!</p>
            <p class="success-sub">Вона вже доступна у каталозі.</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Edit Profile Modal ── -->
    <Transition name="modal">
      <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-box">
          <button class="modal-close" @click="showEditModal = false">✕</button>
          <h2 class="modal-title">Редагувати профіль</h2>
          <div v-if="!editDone" class="create-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Ім'я</label>
                <input v-model="editData.name" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Прізвище</label>
                <input v-model="editData.lastName" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Поточний пароль</label>
              <input v-model="editData.currentPassword" class="form-input" :class="{ error: editErrors.currentPassword }" type="password" placeholder="Для зміни пароля" />
              <span v-if="editErrors.currentPassword" class="form-error">{{ editErrors.currentPassword }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Новий пароль</label>
              <input v-model="editData.newPassword" class="form-input" :class="{ error: editErrors.newPassword }" type="password" placeholder="Залиш порожнім щоб не змінювати" />
              <span v-if="editErrors.newPassword" class="form-error">{{ editErrors.newPassword }}</span>
            </div>
            <div v-if="editErrors.general" class="field-error-box">{{ editErrors.general }}</div>
            <button class="btn btn-primary create-btn" @click="submitEdit">Зберегти зміни</button>
          </div>
          <div v-else class="modal-success">
            <div class="success-icon">✓</div>
            <p class="success-title">Збережено!</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Delete event confirm ── -->
    <Transition name="modal">
      <div v-if="eventToDelete" class="modal-overlay" @click.self="eventToDelete = null">
        <div class="modal-box confirm-modal">
          <h2 class="modal-title">Видалити подію?</h2>
          <p class="confirm-text">Подія <strong>«{{ eventToDelete.title }}»</strong> буде видалена назавжди. Цю дію не можна скасувати.</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="eventToDelete = null">Скасувати</button>
            <button class="btn-danger-confirm" @click="doDeleteEvent">Так, видалити</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Add photo to gallery ── -->
    <Transition name="modal">
      <div v-if="photoEvent" class="modal-overlay" @click.self="photoEvent = null">
        <div class="modal-box confirm-modal">
          <button class="modal-close" @click="photoEvent = null">✕</button>
          <h2 class="modal-title">Додати фото з події</h2>
          <p class="confirm-text">{{ photoEvent.title }}</p>
          <div v-if="!photoDone" class="create-form">
            <div class="form-group">
              <label class="form-label">URL фото</label>
              <input
                v-model="photoUrl"
                class="form-input"
                :class="{ error: photoError }"
                placeholder="https://..."
              />
              <span v-if="photoError" class="form-error">{{ photoError }}</span>
            </div>
            <button class="btn btn-primary create-btn" @click="submitPhoto">Додати до галереї</button>
          </div>
          <div v-else class="modal-success">
            <div class="success-icon">✓</div>
            <p class="success-title">Фото додано!</p>
            <p class="success-sub">Воно з'явилось у галереї на головній.</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Delete account confirm ── -->
    <Transition name="modal">
      <div v-if="showDeleteAccountModal" class="modal-overlay" @click.self="showDeleteAccountModal = false">
        <div class="modal-box confirm-modal">
          <h2 class="modal-title">Видалити акаунт?</h2>
          <p class="confirm-text">Це незворотня дія. Твій акаунт та всі створені тобою події будуть видалені назавжди.</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="showDeleteAccountModal = false">Скасувати</button>
            <button class="btn-danger-confirm" @click="doDeleteAccount">Так, видалити</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useEventsStore, formatDuration } from '@/stores'

const auth = useAuthStore()
const eventsStore = useEventsStore()
const router = useRouter()

const myEvents = computed(() => eventsStore.getUserEvents(auth.user.id))

function formatDate(d) {
  return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isPast(date) {
  return new Date(date) < new Date()
}

// ── Create ──
const showCreateModal = ref(false)
const createDone = ref(false)
const durationHours = ref(2)
const durationMinutes = ref(0)

const defaultEvent = () => ({
  title: '', city: '', category: 'Культура', duration: '',
  date: '', maxParticipants: 10, description: '', image: '',
  host: [auth.user.name, auth.user.last_name].filter(Boolean).join(' ')
})
const newEvent = ref(defaultEvent())
const newErrors = ref({})

function buildDuration() {
  const h = durationHours.value || 0
  const m = durationMinutes.value || 0
  if (h === 0 && m === 0) return null
  return formatDuration(h, m)
}

function validateCreate() {
  newErrors.value = {}
  if (!newEvent.value.title.trim()) newErrors.value.title = 'Введи назву'
  if (!newEvent.value.city) newErrors.value.city = 'Обери місто'
  if (!newEvent.value.date) newErrors.value.date = 'Вкажи дату'
  if (!newEvent.value.description.trim()) newErrors.value.description = 'Додай опис'
  if (!buildDuration()) newErrors.value.duration = 'Вкажи тривалість (год або хв більше 0)'
  return !Object.keys(newErrors.value).length
}

async function submitCreate() {
  if (!validateCreate()) return
  newEvent.value.duration = buildDuration()
  try {
    await eventsStore.createEvent({ ...newEvent.value }, auth.user.id)
    createDone.value = true
    setTimeout(() => closeCreate(), 2200)
  } catch (e) {
    newErrors.value.title = 'Помилка: ' + e.message
  }
}

function closeCreate() {
  showCreateModal.value = false
  setTimeout(() => {
    createDone.value = false
    newEvent.value = defaultEvent()
    durationHours.value = 2
    durationMinutes.value = 0
    newErrors.value = {}
  }, 300)
}

// ── Edit ──
const showEditModal = ref(false)
const editDone = ref(false)
const editData = ref({ name: '', lastName: '', currentPassword: '', newPassword: '' })
const editErrors = ref({})

function openEditModal() {
  editData.value = { name: auth.user.name, lastName: auth.user.last_name || '', currentPassword: '', newPassword: '' }
  editErrors.value = {}
  editDone.value = false
  showEditModal.value = true
}

async function submitEdit() {
  editErrors.value = {}
  if (editData.value.newPassword && !editData.value.currentPassword) {
    editErrors.value.currentPassword = 'Введи поточний пароль'; return
  }
  if (editData.value.newPassword && editData.value.newPassword.length < 6) {
    editErrors.value.newPassword = 'Мінімум 6 символів'; return
  }
  try {
    await auth.updateProfile({
      name: editData.value.name,
      lastName: editData.value.lastName,
      currentPassword: editData.value.currentPassword || undefined,
      newPassword: editData.value.newPassword || undefined
    })
    editDone.value = true
    setTimeout(() => { showEditModal.value = false; editDone.value = false }, 1500)
  } catch (e) { editErrors.value.general = e.message }
}

// ── Delete event ──
const eventToDelete = ref(null)
function confirmDelete(event) { eventToDelete.value = event }
async function doDeleteEvent() {
  await eventsStore.deleteEvent(eventToDelete.value.id, auth.user.id)
  eventToDelete.value = null
}

// ── Gallery photo ──
const photoEvent = ref(null)
const photoUrl = ref('')
const photoError = ref('')
const photoDone = ref(false)

function openAddPhoto(event) {
  photoEvent.value = event
  photoUrl.value = ''
  photoError.value = ''
  photoDone.value = false
}

async function submitPhoto() {
  if (!photoUrl.value.trim()) { photoError.value = 'Введи URL фото'; return }
  if (!/^https?:\/\/.+/.test(photoUrl.value)) { photoError.value = 'Невірний URL'; return }
  await eventsStore.addGalleryPhoto(photoEvent.value.id, photoUrl.value.trim())
  photoDone.value = true
  setTimeout(() => { photoEvent.value = null }, 2000)
}

// ── Delete account ──
const showDeleteAccountModal = ref(false)
async function doDeleteAccount() {
  await auth.deleteAccount(auth.user.id)
  await new Promise(resolve => setTimeout(resolve, 300))
  router.push('/')
}
</script>

<style scoped>
.cabinet-page { padding: 60px 0; }

.cabinet-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 56px; flex-wrap: wrap; gap: 20px; }
.cabinet-greeting { font-size: 14px; color: var(--text-muted); margin-bottom: 4px; }
.cabinet-name { font-family: var(--font-display); font-size: clamp(28px, 5vw, 44px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 4px; }
.cabinet-email { font-size: 14px; color: var(--text-muted); }
.cabinet-header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

.cabinet-section { margin-bottom: 56px; }
.section-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
.events-count { font-size: 13px; font-family: var(--font-body); font-weight: 500; color: var(--lavender); background: rgba(168,163,246,0.1); padding: 2px 10px; border-radius: 100px; }

.events-list { display: flex; flex-direction: column; gap: 12px; }
.my-event-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); display: grid; grid-template-columns: 80px 1fr auto; gap: 20px; align-items: center; padding: 16px; transition: border-color var(--transition); }
.my-event-card:hover { border-color: var(--border-hover); }
.my-event-img { width: 80px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.my-event-img img { width: 100%; height: 100%; object-fit: cover; }
.my-event-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.my-event-city { font-size: 12px; color: var(--lavender); text-transform: uppercase; letter-spacing: 0.03em; font-weight: 600; }
.my-event-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.my-event-date { font-size: 13px; color: var(--text-muted); }
.my-event-actions { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }

.btn-delete { font-size: 13px; color: #ff6b6b; background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: background var(--transition); font-family: var(--font-body); }
.btn-delete:hover { background: rgba(255,107,107,0.1); }

.btn-add-photo { font-size: 13px; color: var(--lavender); background: rgba(168,163,246,0.08); border: 1px solid rgba(168,163,246,0.2); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-family: var(--font-body); transition: all var(--transition); }
.btn-add-photo:hover { background: rgba(168,163,246,0.15); }

.cabinet-empty { text-align: center; padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 20px; color: var(--text-muted); }

.delete-account-row { padding-top: 32px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
.btn-delete-account { font-size: 13px; color: var(--text-muted); background: none; border: none; cursor: pointer; font-family: var(--font-body); transition: color var(--transition); padding: 6px 0; }
.btn-delete-account:hover { color: #ff6b6b; }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
.list-leave-to { opacity: 0; transform: translateX(16px); }

.create-modal { max-width: 640px; max-height: 90vh; overflow-y: auto; }
.create-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
textarea.form-input { resize: vertical; min-height: 100px; }
.create-btn { justify-content: center; margin-top: 8px; }

.duration-picker { display: flex; gap: 10px; }
.duration-field { display: flex; align-items: center; gap: 8px; }
.duration-num { width: 72px; text-align: center; }
.duration-unit { font-size: 13px; color: var(--text-muted); white-space: nowrap; }

.modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 24px; }
.modal-close { position: absolute; top: 16px; right: 16px; color: var(--text-muted); font-size: 16px; cursor: pointer; background: none; border: none; line-height: 1; transition: color var(--transition); }
.modal-close:hover { color: var(--text); }

.modal-success { text-align: center; padding: 20px 0; }
.success-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(168,163,246,0.15); border: 1px solid var(--lavender); color: var(--lavender); font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin-bottom: 8px; }
.success-sub { color: var(--text-muted); font-size: 14px; }

.field-error-box { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: var(--radius); padding: 12px 16px; font-size: 13px; color: #ff6b6b; }

.confirm-modal { max-width: 420px; }
.confirm-text { color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
.confirm-actions { display: flex; gap: 12px; justify-content: flex-end; }
.btn-danger-confirm { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); color: #ff6b6b; padding: 11px 20px; border-radius: var(--radius); font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-body); transition: all var(--transition); }
.btn-danger-confirm:hover { background: rgba(255,107,107,0.2); }

@media (max-width: 640px) {
  .my-event-card { grid-template-columns: 1fr; }
  .my-event-img { width: 100%; height: 140px; }
  .my-event-actions { flex-direction: row; flex-wrap: wrap; }
  .form-row { grid-template-columns: 1fr; }
  .create-modal { padding: 24px 20px; }
}
</style>