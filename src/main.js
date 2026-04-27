import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from './stores'
import { useEventsStore } from './stores'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()
const eventsStore = useEventsStore()

Promise.all([
  authStore.init(),
  eventsStore.fetchEvents(),
  eventsStore.fetchGallery()
]).then(() => {
  app.mount('#app')
})