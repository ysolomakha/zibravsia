import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue') },
  { path: '/events', component: () => import('@/views/EventsView.vue') },
  { path: '/events/:id', component: () => import('@/views/EventDetailView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  { path: '/gallery', component: () => import('@/views/GalleryView.vue') },
  { path: '/auth', component: () => import('@/views/AuthView.vue') },
  { path: '/cabinet', component: () => import('@/views/CabinetView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  const user = JSON.parse(localStorage.getItem('zib_user') || 'null')
  if (to.meta.requiresAuth && !user) {
    return '/auth'
  }
})

export default router
