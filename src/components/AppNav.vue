<template>
  <nav class="nav">
    <div class="container nav-inner">

      <RouterLink to="/" class="nav-logo" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
        <span class="logo-text">Зібрався</span>
        <span class="logo-icon" :class="{ 'logo-animate': logoHover }">
          <img src="/logo.svg" alt="?" width="50" height="50" />
        </span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/events" class="nav-link">Події</RouterLink>
        <RouterLink to="/about" class="nav-link">Про нас</RouterLink>
        <RouterLink to="/gallery" class="nav-link">Галерея</RouterLink>
      </div>

      <div class="nav-actions">
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/cabinet" class="btn btn-ghost">{{ auth.user.name }}</RouterLink>
          <button class="btn btn-outline" @click="handleLogout">Вийти</button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="btn btn-primary">Увійти</RouterLink>
        </template>
      </div>

      <button class="nav-burger" @click="menuOpen = !menuOpen" aria-label="Меню">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <Transition name="menu">
      <div v-if="menuOpen" class="nav-mobile">
        <RouterLink to="/events" class="nav-mobile-link" @click="menuOpen = false">Події</RouterLink>
        <RouterLink to="/about" class="nav-mobile-link" @click="menuOpen = false">Про нас</RouterLink>
        <RouterLink to="/gallery" class="nav-mobile-link" @click="menuOpen = false">Галерея</RouterLink>
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/cabinet" class="nav-mobile-link" @click="menuOpen = false">Кабінет</RouterLink>
          <button class="nav-mobile-link" @click="handleLogout">Вийти</button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="nav-mobile-link" @click="menuOpen = false">Увійти</RouterLink>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)
const logoHover = ref(false)

function handleLogout() {
  auth.logout()
  menuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13, 15, 26, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.nav-inner { display: flex; align-items: center; gap: 32px; height: 68px; }

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0px;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--yellow);
  letter-spacing: -0.02em;
  margin-right: auto;
  text-decoration: none;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--yellow);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}
.logo-icon.logo-animate { transform: rotate(15deg) scale(1.1); }

.logo-text {}

.nav-links { display: flex; gap: 4px; }
.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all var(--transition);
}
.nav-link:hover, .nav-link.router-link-active { color: var(--text); background: rgba(168,163,246,0.08); }

.nav-actions { display: flex; gap: 8px; align-items: center; }

.nav-burger { display: none; flex-direction: column; gap: 5px; padding: 8px; cursor: pointer; background: none; border: none; }
.nav-burger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all var(--transition); }
.nav-burger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-burger span.open:nth-child(2) { opacity: 0; }
.nav-burger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-mobile { display: flex; flex-direction: column; padding: 16px 24px 24px; border-top: 1px solid var(--border); gap: 4px; }
.nav-mobile-link { display: block; padding: 12px 16px; border-radius: 8px; font-size: 15px; color: var(--text); background: none; border: none; text-align: left; cursor: pointer; transition: background var(--transition); font-family: var(--font-body); }
.nav-mobile-link:hover { background: rgba(168,163,246,0.08); }

.menu-enter-active, .menu-leave-active { transition: opacity 0.2s, transform 0.2s; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-burger { display: flex; }
}
</style>
