<template>
  <div class="auth-page">
    <div class="auth-wrap">

      <div class="auth-header">
       <RouterLink to="/" class="auth-logo">
          Зібрався
         <img src="/logo.svg" alt="?" width="32" height="32" style="flex-shrink:0" />
      </RouterLink>
        <p class="auth-sub">{{ isLogin ? 'Раді тебе знову бачити' : 'Приєднуйся до спільноти' }}</p>
      </div>

      <div class="auth-tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true">Увійти</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">Реєстрація</button>
      </div>

      <div class="auth-card">
        <!-- Login -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="loginData.email" class="form-input" :class="{ error: loginErrors.email }" type="email" placeholder="your@email.com" />
            <span v-if="loginErrors.email" class="form-error">{{ loginErrors.email }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <input v-model="loginData.password" class="form-input" :class="{ error: loginErrors.password }" type="password" placeholder="••••••••" />
            <span v-if="loginErrors.password" class="form-error">{{ loginErrors.password }}</span>
          </div>
          <div v-if="loginErrors.general" class="auth-error">{{ loginErrors.general }}</div>
          <button type="submit" class="btn btn-primary auth-btn">Увійти</button>
        </form>

        <!-- Register -->
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Ім'я</label>
              <input v-model="regData.name" class="form-input" :class="{ error: regErrors.name }" placeholder="Ім'я" />
              <span v-if="regErrors.name" class="form-error">{{ regErrors.name }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Прізвище</label>
              <input v-model="regData.lastName" class="form-input" :class="{ error: regErrors.lastName }" placeholder="Прізвище" />
              <span v-if="regErrors.lastName" class="form-error">{{ regErrors.lastName }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Вік</label>
              <input v-model="regData.age" class="form-input" :class="{ error: regErrors.age }" type="number" min="1" max="120" placeholder="Твій вік" />
              <span v-if="regErrors.age" class="form-error">{{ regErrors.age }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="regData.email" class="form-input" :class="{ error: regErrors.email }" type="email" placeholder="your@email.com" />
              <span v-if="regErrors.email" class="form-error">{{ regErrors.email }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <input v-model="regData.password" class="form-input" :class="{ error: regErrors.password }" type="password" placeholder="Мінімум 6 символів" />
            <span v-if="regErrors.password" class="form-error">{{ regErrors.password }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Повторити пароль</label>
            <input v-model="regData.confirm" class="form-input" :class="{ error: regErrors.confirm }" type="password" placeholder="••••••••" />
            <span v-if="regErrors.confirm" class="form-error">{{ regErrors.confirm }}</span>
          </div>
          <label class="checkbox-label" :class="{ 'checkbox-error': regErrors.terms }">
            <input type="checkbox" v-model="regData.terms" class="checkbox-input" />
            <span class="checkbox-box" :class="{ checked: regData.terms }"></span>
            <span class="checkbox-text">Я погоджуюсь з <a href="#" @click.prevent>правилами спільноти</a> та підтверджую що мені виповнилось 16 років</span>
          </label>
          <span v-if="regErrors.terms" class="form-error">{{ regErrors.terms }}</span>
          <div v-if="regErrors.general" class="auth-error">{{ regErrors.general }}</div>
          <button type="submit" class="btn btn-primary auth-btn">Зареєструватись</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useEventsStore } from '@/stores'

const router = useRouter()
const auth = useAuthStore()
const isLogin = ref(true)

const loginData = ref({ email: '', password: '' })
const loginErrors = ref({})
const regData = ref({ name: '', lastName: '', age: '', email: '', password: '', confirm: '', terms: false })
const regErrors = ref({})

async function handleLogin() {
  loginErrors.value = {}
  if (!loginData.value.email) loginErrors.value.email = 'Введи email'
  if (!loginData.value.password) loginErrors.value.password = 'Введи пароль'
  if (Object.keys(loginErrors.value).length) return
  try {
    await auth.login(loginData.value.email, loginData.value.password)
    const events = useEventsStore()
    await events.fetchEvents()
    await events.fetchGallery()
    router.push('/cabinet')
  } catch (e) { loginErrors.value.general = e.message }
}

async function handleRegister() {
  regErrors.value = {}
  if (!regData.value.name.trim()) regErrors.value.name = "Введи ім'я"
  if (!regData.value.lastName.trim()) regErrors.value.lastName = 'Введи прізвище'
  if (!regData.value.age) regErrors.value.age = 'Введи вік'
  else if (parseInt(regData.value.age) < 16) regErrors.value.age = 'Реєстрація з 16 років'
  else if (parseInt(regData.value.age) > 120) regErrors.value.age = 'Невірний вік'
  if (!regData.value.email) regErrors.value.email = 'Введи email'
  else if (!/\S+@\S+\.\S+/.test(regData.value.email)) regErrors.value.email = 'Невірний формат'
  if (!regData.value.password) regErrors.value.password = 'Введи пароль'
  else if (regData.value.password.length < 6) regErrors.value.password = 'Мінімум 6 символів'
  if (regData.value.password !== regData.value.confirm) regErrors.value.confirm = 'Паролі не збігаються'
  if (!regData.value.terms) regErrors.value.terms = 'Необхідно погодитись з правилами'
  if (Object.keys(regErrors.value).length) return
  try {
    await auth.register(regData.value.name, regData.value.lastName, regData.value.age, regData.value.email, regData.value.password)
    const events = useEventsStore()
    await events.fetchEvents()
    await events.fetchGallery()
    router.push('/cabinet')
  } catch (e) { regErrors.value.general = e.message }
}
</script>

<style scoped>
.auth-page { min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 60px 24px; }
.auth-wrap { width: 100%; max-width: 480px; }

.auth-header { text-align: center; margin-bottom: 32px; }

.auth-logo {
  display: inline-flex;
  align-items: center;
  gap: 0px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--yellow);
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  text-decoration: none;
}

.auth-sub { color: var(--text-muted); font-size: 15px; }

.auth-tabs {
  display: flex;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 4px;
  margin-bottom: 20px;
}
.auth-tabs button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all var(--transition);
  cursor: pointer;
  background: none;
  border: none;
  font-family: var(--font-body);
}
.auth-tabs button.active { background: var(--bg-3); color: var(--text); }

.auth-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.auth-error { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: var(--radius); padding: 12px 16px; font-size: 13px; color: #ff6b6b; }
.auth-btn { width: 100%; justify-content: center; padding: 16px; margin-top: 4px; font-size: 15px; }

.checkbox-label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 4px 0; }
.checkbox-label.checkbox-error .checkbox-box { border-color: #ff6b6b; }
.checkbox-input { display: none; }
.checkbox-box { flex-shrink: 0; width: 18px; height: 18px; border: 1.5px solid var(--border-hover); border-radius: 4px; margin-top: 2px; transition: all var(--transition); position: relative; }
.checkbox-box.checked { background: var(--lavender); border-color: var(--lavender); }
.checkbox-box.checked::after { content: ''; position: absolute; left: 4px; top: 1px; width: 6px; height: 10px; border: 2px solid var(--bg); border-top: none; border-left: none; transform: rotate(45deg); }
.checkbox-text { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
.checkbox-text a { color: var(--lavender); text-decoration: underline; }

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
  .auth-card { padding: 24px 20px; }
}
</style>
