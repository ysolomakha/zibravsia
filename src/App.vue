<template>
  <div id="layout">
    <AppNav />
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppNav from '@/components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useEventsStore } from '@/stores'

const eventsStore = useEventsStore()
let refreshTimeout = null

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    // Debounce — чекаємо 300мс щоб не спамити запитами
    clearTimeout(refreshTimeout)
    refreshTimeout = setTimeout(async () => {
      await eventsStore.fetchEvents()
      await eventsStore.fetchGallery()
    }, 300)
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearTimeout(refreshTimeout)
})
</script>

<style>
#layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main { flex: 1; }
</style>