import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export function formatDuration(hours, minutes) {
  if (hours === 0 && minutes === 0) return 'Весь день'
  if (hours === 0) return `${minutes} хв`
  if (minutes === 0) return `${hours} год`
  return `${hours} год ${minutes} хв`
}

function futureDateFrom(daysFromNow, hour = 12) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

const MOCK_EVENTS = [
  { id: '1', title: 'Чайна церемонія', city: 'Київ', category: 'Культура', date: futureDateFrom(3, 16), duration: '2 год', host: 'Оля Сенченко', description: 'Зануримось у традицію китайського чайного ритуалу. Навчимося розрізняти сорти чаю, правильно заварювати та насолоджуватись моментом у тиші. Кожен учасник отримає пробник улюбленого чаю додому.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', maxParticipants: 8, currentParticipants: 5, userId: 'mock' },
  { id: '2', title: 'Йога на природі', city: 'Львів', category: 'Спорт', date: futureDateFrom(7, 8), duration: '1 год 30 хв', host: 'Марко Іваненко', description: 'Ранкова практика хатха-йоги у парку Знесіння. Підходить для початківців і тих, хто хоче відновити практику. Беріть килимок і гарний настрій — решта є.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', maxParticipants: 15, currentParticipants: 9, userId: 'mock' },
  { id: '3', title: 'Пікнік-кінопоказ', city: 'Одеса', category: 'Кіно', date: futureDateFrom(14, 20), duration: '3 год', host: 'Дарина Коваль', description: 'Дивимось незалежне українське кіно під відкритим небом на Ланжероні. Буде пледи, свічки, теплий пунш. Список фільмів голосуємо разом у чаті напередодні.', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80', maxParticipants: 30, currentParticipants: 18, userId: 'mock' },
  { id: '4', title: 'Виготовлення свічок', city: 'Харків', category: 'Майстерня', date: futureDateFrom(18, 13), duration: '2 год 30 хв', host: 'Тетяна Мороз', description: 'Майстер-клас із виготовлення соєвих свічок із натуральними ароматами. Кожен іде додому зі своїми двома свічками. Всі матеріали включені у вартість. Місць дуже мало.', image: 'https://images.unsplash.com/photo-1603218678692-3967d7523bb0?q=80', maxParticipants: 10, currentParticipants: 7, userId: 'mock' },
  { id: '5', title: 'Вечір живої музики', city: 'Київ', category: 'Музика', date: futureDateFrom(25, 19), duration: '3 год', host: 'Назар Білик', description: 'Камерний вечір у лофті: акустична гітара, фортепіано, голос. Програма — джаз і bossa nova. Формат: 40 хвилин музики, 20 хвилин спілкування. Вино та закуски за бажанням.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', maxParticipants: 25, currentParticipants: 12, userId: 'mock' },
  { id: '6', title: 'Speaking Club', city: 'Дніпро', category: 'Навчання', date: futureDateFrom(32, 11), duration: '2 год', host: 'Іван Стець', description: 'Англомовний розмовний клуб для рівнів B1+. Тема: подорожі та їхній вплив на особистість. Формат — малі групи по 4 людини зі зміною партнерів кожні 20 хвилин.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', maxParticipants: 16, currentParticipants: 8, userId: 'mock' },
  { id: '7', title: 'Обговорення книги', city: 'Львів', category: 'Культура', date: futureDateFrom(40, 15), duration: '2 год', host: 'Соломія Гук', description: "Читаємо «Ворошиловград» Жадана. Збираємося щоб поділитись враженнями, знайти спільні теми та посперечатись про фінал. Книгу бажано прочитати заздалегідь.", image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', maxParticipants: 12, currentParticipants: 6, userId: 'mock' },
  { id: '8', title: 'Пленер у місті', city: 'Одеса', category: 'Мистецтво', date: futureDateFrom(50, 10), duration: '4 год', host: 'Аліна Журба', description: 'Малюємо Одесу — старе місто, дворики, море. Підходить для будь-якого рівня. Акварель або олівці — на вибір.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', maxParticipants: 20, currentParticipants: 11, userId: 'mock' }
]

//Auth Store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('zib_user') || 'null'))
  const isLoggedIn = computed(() => !!user.value)

  function register(name, lastName, age, email, password) {
    const users = JSON.parse(localStorage.getItem('zib_users') || '[]')
    if (users.find(u => u.email === email)) throw new Error('Цей email вже зареєстрований')
    if (parseInt(age) < 16) throw new Error('Реєстрація доступна з 16 років')
    const newUser = { id: Date.now().toString(), name, lastName, age: parseInt(age), email, password }
    users.push(newUser)
    localStorage.setItem('zib_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    user.value = safeUser
    localStorage.setItem('zib_user', JSON.stringify(safeUser))
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem('zib_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Невірний email або пароль')
    const { password: _, ...safeUser } = found
    user.value = safeUser
    localStorage.setItem('zib_user', JSON.stringify(safeUser))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('zib_user')
  }

  function updateProfile(updates) {
    const users = JSON.parse(localStorage.getItem('zib_users') || '[]')
    const idx = users.findIndex(u => u.id === user.value.id)
    if (idx === -1) throw new Error('Користувача не знайдено')
    if (updates.newPassword) {
      if (updates.currentPassword !== users[idx].password) throw new Error('Невірний поточний пароль')
      users[idx].password = updates.newPassword
    }
    if (updates.name) users[idx].name = updates.name
    if (updates.lastName !== undefined) users[idx].lastName = updates.lastName
    localStorage.setItem('zib_users', JSON.stringify(users))
    const { password: _, ...safeUser } = users[idx]
    user.value = safeUser
    localStorage.setItem('zib_user', JSON.stringify(safeUser))
  }

  return { user, isLoggedIn, register, login, logout, updateProfile }
})

//Events Store
export const useEventsStore = defineStore('events', () => {
  const customEvents = ref(JSON.parse(localStorage.getItem('zib_events') || '[]'))
  const mockOverrides = ref(JSON.parse(localStorage.getItem('zib_mock_overrides') || '{}'))

  function _persist() {
    localStorage.setItem('zib_events', JSON.stringify(customEvents.value))
  }
  function _persistOverrides() {
    localStorage.setItem('zib_mock_overrides', JSON.stringify(mockOverrides.value))
  }

  const allEvents = computed(() => {
    const mocks = MOCK_EVENTS.map(e => ({ ...e, ...mockOverrides.value[e.id] }))
    return [...mocks, ...customEvents.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  function getAll() { return allEvents.value }

  function getById(id) {
    const mock = MOCK_EVENTS.find(e => e.id === id)
    if (mock) return { ...mock, ...mockOverrides.value[id] }
    return customEvents.value.find(e => e.id === id) || null
  }

  const userEventsMap = computed(() => {
    const map = {}
    for (const e of customEvents.value) {
      if (!map[e.userId]) map[e.userId] = []
      map[e.userId].push(e)
    }
    return map
  })

  function getUserEvents(userId) {
    return (userEventsMap.value[userId] || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  function createEvent(data, userId) {
    const newEvent = { ...data, id: Date.now().toString(), userId, currentParticipants: 0 }
    customEvents.value = [...customEvents.value, newEvent]
    _persist()
    return newEvent
  }

  function deleteEvent(id, userId) {
    customEvents.value = customEvents.value.filter(e => !(e.id === id && e.userId === userId))
    _persist()
  }

  function joinEvent(eventId, { name, phone, email }) {
    const registrations = JSON.parse(localStorage.getItem('zib_registrations') || '[]')
    const already = registrations.find(r => r.eventId === eventId && (r.email === email || r.phone === phone))
    if (already) return 'Ти вже зареєстрований на цю подію з таким email або телефоном'
    const event = getById(eventId)
    if (!event) return 'Подію не знайдено'
    if (event.currentParticipants >= event.maxParticipants) return 'Вільних місць немає'
    const isMock = MOCK_EVENTS.some(e => e.id === eventId)
    if (isMock) {
      mockOverrides.value = {
        ...mockOverrides.value,
        [eventId]: { ...mockOverrides.value[eventId], currentParticipants: (event.currentParticipants || 0) + 1 }
      }
      _persistOverrides()
    } else {
      customEvents.value = customEvents.value.map(e =>
        e.id === eventId ? { ...e, currentParticipants: (e.currentParticipants || 0) + 1 } : e
      )
      _persist()
    }
    registrations.push({ eventId, name, phone, email, date: new Date().toISOString() })
    localStorage.setItem('zib_registrations', JSON.stringify(registrations))
    return null
  }

  function hasJoined(eventId, email, phone) {
    const registrations = JSON.parse(localStorage.getItem('zib_registrations') || '[]')
    return registrations.some(r => r.eventId === eventId && (r.email === email || (phone && r.phone === phone)))
  }

  const CITIES = ['Всі міста', 'Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро']
  const CATEGORIES = ['Всі категорії', 'Культура', 'Спорт', 'Музика', 'Майстерня', 'Навчання', 'Кіно', 'Мистецтво']

  return { allEvents, getAll, getById, getUserEvents, createEvent, deleteEvent, joinEvent, hasJoined, CITIES, CATEGORIES }
})
