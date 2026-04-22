<template>
  <main class="screen scrollable profile-screen">
    <div v-if="authStore.user" class="profile-header">
      <div class="avatar">{{ (authStore.user.firstName || authStore.user.login || 'U')[0] }}</div>
      <h2 class="profile-name">{{ authStore.user.firstName || authStore.user.login }}</h2>
      <p class="profile-phone">{{ authStore.user.login }}</p>
    </div>

    <div v-if="!authStore.user" class="auth-card">
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: activeAuthTab === 'login' }" @click="activeAuthTab = 'login'">Вход</button>
        <button class="auth-tab" :class="{ active: activeAuthTab === 'register' }" @click="activeAuthTab = 'register'">Регистрация</button>
      </div>
      <Transition name="fade-slide" mode="out-in">
        <div :key="activeAuthTab" class="auth-fields">
          <input v-model="form.login" class="auth-input" placeholder="Логин" />
          <input
            v-if="activeAuthTab === 'register'"
            v-model="form.firstName"
            class="auth-input"
            placeholder="Имя"
          />
          <input v-model="form.password" class="auth-input" type="password" placeholder="Пароль" />
        </div>
      </Transition>
      <p v-if="authStore.error" class="error-text">{{ authStore.error }}</p>
      <div class="auth-actions">
        <button
          class="auth-btn"
          :class="{ secondary: activeAuthTab === 'register' }"
          :disabled="authStore.loading"
          @click="submitAuth"
        >
          {{ activeAuthTab === 'login' ? 'Войти' : 'Создать аккаунт' }}
        </button>
      </div>
    </div>

    <div v-else class="menu-list">
      <button class="menu-item menu-button" @click="featureInDevelopment('История заказов')">
        <IconPackage class="icon" /> История заказов <span class="arrow">›</span>
      </button>
      <button class="menu-item menu-button" @click="featureInDevelopment('Избранное')">
        <IconHeart class="icon" /> Избранное <span class="arrow">›</span>
      </button>
      <button class="menu-item menu-button" @click="featureInDevelopment('Мои адреса')">
        <IconLocation class="icon" /> Мои адреса <span class="arrow">›</span>
      </button>
      <button class="menu-item menu-button" @click="featureInDevelopment('Способы оплаты')">
        <IconCard class="icon" /> Способы оплаты <span class="arrow">›</span>
      </button>
      <div class="menu-divider"></div>
      <button class="menu-item menu-button" @click="featureInDevelopment('Служба поддержки')">
        <IconChat class="icon" /> Служба поддержки <span class="arrow">›</span>
      </button>
      <button class="menu-item menu-button" @click="featureInDevelopment('Настройки')">
        <IconSettings class="icon" /> Настройки <span class="arrow">›</span>
      </button>
      <button class="menu-item logout" @click="logout">
        <IconLogout class="icon" /> Выйти <span class="arrow">›</span>
      </button>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import IconPackage from './icons/IconPackage.vue'
import IconHeart from './icons/IconHeart.vue'
import IconLocation from './icons/IconLocation.vue'
import IconCard from './icons/IconCard.vue'
import IconChat from './icons/IconChat.vue'
import IconSettings from './icons/IconSettings.vue'
import IconLogout from './icons/IconLogout.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const emit = defineEmits(['notify'])
const authStore = useAuthStore()
const cartStore = useCartStore()

const form = reactive({
  login: '',
  password: '',
  firstName: '',
})
const activeAuthTab = ref('login')

const emitLogin = () => {
  if (!form.login.trim() || !form.password) {
    emit('notify', { type: 'error', text: 'Заполни логин и пароль' })
    return
  }
  return authStore.login({ login: form.login, password: form.password })
}

const emitRegister = () => {
  if (form.login.trim().length < 3) {
    emit('notify', { type: 'error', text: 'Логин должен быть от 3 символов' })
    return
  }
  if (form.password.length < 5) {
    emit('notify', { type: 'error', text: 'Пароль должен быть от 5 символов' })
    return
  }
  return authStore.register({
    login: form.login,
    password: form.password,
    firstName: form.firstName || form.login,
  })
}

const submitAuth = async () => {
  if (activeAuthTab.value === 'login') {
    const ok = await emitLogin()
    if (ok) emit('notify', { type: 'success', text: 'Успешный вход' })
    return
  }
  const ok = await emitRegister()
  if (ok) emit('notify', { type: 'success', text: 'Регистрация успешна' })
}

const featureInDevelopment = (featureName) => {
  emit('notify', { type: 'success', text: `${featureName}: раздел еще в разработке` })
}

const logout = () => {
  authStore.logout()
  cartStore.reset()
  emit('notify', { type: 'success', text: 'Вы вышли из аккаунта' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');

:root {
  --primary-dark: #4B3621;
  --primary-light: #AC7F5E;
}

.screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scrollable {
  overflow-y: auto;
  padding-bottom: 90px;
}

.profile-screen {
  padding: 30px 20px;
}

.profile-header {
  text-align: center;
  border-bottom: 2px solid var(--primary-dark);
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  background: var(--primary-light);
  color: white;
  font-size: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.2);
  font-family: 'Manrope';
  font-weight: 600;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  font-family: 'Manrope';
}

.profile-phone {
  color: gray;
  font-size: 14px;
  margin-top: 5px;
  font-family: 'Manrope';
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Manrope';
}

.menu-button {
  width: 100%;
  border: none;
  background: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

.menu-button:active {
  transform: scale(0.95);
  opacity: 0.85;
}

.menu-item .icon {
  margin-right: 15px;
  font-size: 24px;
}

.menu-item .arrow {
  margin-left: auto;
  color: gray;
}

.menu-divider {
  height: 1px;
  background: #eee;
  margin: 10px 0;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.auth-tab {
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f1ece5;
  color: var(--primary-dark);
  font-family: 'Manrope';
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

.auth-tab.active {
  background: var(--primary-dark);
  color: #fff;
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-input {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 14px;
  background: #f9f9f9;
  font-family: 'Manrope';
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.auth-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(172, 127, 94, 0.2);
}

.auth-actions {
  display: flex;
  gap: 8px;
}

.auth-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: var(--primary-dark);
  color: #fff;
  cursor: pointer;
  font-family: 'Manrope';
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

.auth-btn.secondary {
  background: var(--primary-light);
}

.auth-btn:active,
.auth-tab:active {
  transform: scale(0.95);
  opacity: 0.85;
}

.logout {
  color: #fff;
  background: #d9534f;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.error-text {
  margin: 0;
  color: #b00020;
  font-size: 13px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
