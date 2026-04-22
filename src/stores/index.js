import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'

export function formatDuration(hours, minutes) {
  if (hours === 0 && minutes === 0) return 'Весь день'
  if (hours === 0) return `${minutes} хв`
  if (minutes === 0) return `${hours} год`
  return `${hours} год ${minutes} хв`
}

export function getEventStatus(event) {
  const now = new Date()
  const start = new Date(event.date)
  let durationMinutes = 0
  const dur = event.duration || ''
  const hoursMatch = dur.match(/(\d+)\s*год/)
  const minutesMatch = dur.match(/(\d+)\s*хв/)
  if (hoursMatch) durationMinutes += parseInt(hoursMatch[1]) * 60
  if (minutesMatch) durationMinutes += parseInt(minutesMatch[1])
  if (durationMinutes === 0) durationMinutes = 120
  const end = new Date(start.getTime() + durationMinutes * 60000)
  if (now < start) return 'active'
  if (now >= start && now < end) return 'ongoing'
  return 'ended'
}

// ── Auth Store ────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  async function init() {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      await loadUser(data.session.user)
    }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        user.value = null
      } else if (event === 'TOKEN_REFRESHED' && session) {
        await loadUser(session.user)
      }
    })
  }

  async function loadUser(authUser) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single()
    if (data) {
      user.value = { ...data, email: authUser.email }
    }
  }

  async function register(name, lastName, age, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    await new Promise(resolve => setTimeout(resolve, 500))
    const { error: dbError } = await supabase.from('users').insert({
      auth_id: data.user.id,
      name,
      last_name: lastName,
      age: parseInt(age),
      email,
      password_hash: '—'
    })
    if (dbError) throw new Error(dbError.message)
    await new Promise(resolve => setTimeout(resolve, 300))
    await loadUser(data.user)
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Невірний email або пароль')
    await loadUser(data.user)
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  async function updateProfile(updates) {
    if (!user.value) return
    if (updates.newPassword) {
      const { error } = await supabase.auth.updateUser({ password: updates.newPassword })
      if (error) throw new Error(error.message)
    }
    const { error } = await supabase
      .from('users')
      .update({ name: updates.name, last_name: updates.lastName })
      .eq('id', user.value.id)
    if (error) throw new Error(error.message)
    user.value = { ...user.value, name: updates.name, last_name: updates.lastName }
  }

  async function deleteAccount(userId) {
  // Спочатку видаляємо всі події юзера
  const { data: userEvents } = await supabase
    .from('events')
    .select('id')
    .eq('user_id', userId)
  
  if (userEvents && userEvents.length > 0) {
    const eventIds = userEvents.map(e => e.id)
    // Видаляємо галерею цих подій
    await supabase.from('gallery_photos').delete().in('event_id', eventIds)
    // Видаляємо реєстрації на ці події
    await supabase.from('registrations').delete().in('event_id', eventIds)
    // Видаляємо самі події
    await supabase.from('events').delete().eq('user_id', userId)
  }

  // Видаляємо юзера з нашої таблиці
  await supabase.from('users').delete().eq('id', userId)
  // Виходимо
  await supabase.auth.signOut()
  user.value = null
}

  return { user, isLoggedIn, init, register, login, logout, updateProfile, deleteAccount }
})

// ── Events Store ──────────────────────────────────────────────
export const useEventsStore = defineStore('events', () => {
  const dbEvents = ref([])
  const galleryPhotos = ref([])
  const loading = ref(false)

  function dbToEvent(e) {
    return {
      id: e.id,
      title: e.title,
      city: e.city,
      category: e.category,
      date: e.date,
      duration: e.duration,
      description: e.description,
      image: e.image_url,
      maxParticipants: e.max_participants,
      currentParticipants: e.current_participants,
      host: e.host_name,
      userId: e.user_id
    }
  }

  async function fetchEvents() {
    loading.value = true
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (!error && data) {
      dbEvents.value = data.map(dbToEvent)
    }
    loading.value = false
  }

  async function fetchGallery() {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('added_at', { ascending: false })
    if (!error && data) {
      galleryPhotos.value = data.map(p => ({
        id: p.id,
        eventId: p.event_id,
        url: p.url,
        eventTitle: p.event_title,
        eventDate: p.event_date,
        addedAt: p.added_at
      }))
    }
  }

  const allEvents = computed(() => {
    return dbEvents.value
      .filter(e => getEventStatus(e) !== 'ended')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  function getAll() { return allEvents.value }

  function getById(id) {
    return dbEvents.value.find(e => e.id === id) || null
  }

  function getUserEvents(userId) {
    return dbEvents.value
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  async function createEvent(data, userId) {
    const { data: inserted, error } = await supabase
      .from('events')
      .insert({
        title: data.title,
        city: data.city,
        category: data.category,
        date: data.date + ':00+03:00',
        duration: data.duration,
        description: data.description,
        image_url: data.image || null,
        max_participants: data.maxParticipants,
        current_participants: 0,
        host_name: data.host,
        user_id: userId
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    dbEvents.value = [...dbEvents.value, dbToEvent(inserted)]
    return inserted
  }

  async function deleteEvent(id, userId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
    dbEvents.value = dbEvents.value.filter(e => e.id !== id)
    galleryPhotos.value = galleryPhotos.value.filter(p => p.eventId !== id)
  }

  async function joinEvent(eventId, { name, phone, email }) {
    // Перевірка дублювання
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .maybeSingle()
    if (existing) return 'Ти вже зареєстрований на цю подію з таким email'

    const { error } = await supabase.from('registrations').insert({
      event_id: eventId,
      name,
      phone: phone || null,
      email
    })
    if (error) return 'Не вдалось зареєструватись'

    await supabase.rpc('increment_participants', { event_id: eventId })
    await fetchEvents()
    return null
  }

  async function hasJoined(eventId, email) {
    if (!email) return false
    const { data } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .maybeSingle()
    return !!data
  }

  async function addGalleryPhoto(eventId, url) {
    const event = getById(eventId)
    if (!event) return
    const { error } = await supabase.from('gallery_photos').insert({
      event_id: eventId,
      url,
      event_title: event.title,
      event_date: event.date
    })
    if (!error) await fetchGallery()
  }

  async function deleteGalleryPhoto(photoId) {
    const { error } = await supabase.from('gallery_photos').delete().eq('id', photoId)
    if (!error) {
      galleryPhotos.value = galleryPhotos.value.filter(p => p.id !== photoId)
    }
  }

  const CITIES = ['Всі міста', 'Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро']
  const CATEGORIES = ['Всі категорії', 'Культура', 'Спорт', 'Музика', 'Майстерня', 'Навчання', 'Кіно', 'Мистецтво']

  return {
    allEvents, galleryPhotos, loading,
    fetchEvents, fetchGallery,
    getAll, getById, getUserEvents,
    createEvent, deleteEvent, joinEvent, hasJoined,
    addGalleryPhoto, deleteGalleryPhoto,
    CITIES, CATEGORIES
  }
})