<template>
  <div class="app-container">
    <div class="main-interface">
      <Header
        :current-tab="currentTab"
        :is-authorized="authStore.isAuthorized"
        :search-query="searchQuery"
        :selected-address="selectedAddress"
        shadow
        @navigate="currentTab = $event"
        @update:search-query="searchQuery = $event"
        @address-click="handleAddressClick"
      />

      <Transition name="fade-slide" mode="out-in">
        <div
          v-if="isWideDesktop && currentTab === 'home'"
          key="desktop-layout"
          class="desktop-layout"
        >
          <div class="desktop-home-wrap">
            <HomeScreen :search-query="searchQuery" @notify="showToast" />
          </div>
          <CartScreen
            class="desktop-cart"
            :address-value="selectedAddress"
            :geo-location-value="selectedGeolocation"
            :focus-trigger="addressFocusTrigger"
            @update:address-value="selectedAddress = $event"
            @update:geo-location-value="selectedGeolocation = $event"
            @notify="showToast"
          />
        </div>
        <RouterView v-else v-slot="{ Component }">
          <component
            :is="Component"
            :search-query="searchQuery"
            :address-value="selectedAddress"
            :geo-location-value="selectedGeolocation"
            :focus-trigger="addressFocusTrigger"
            @update:address-value="selectedAddress = $event"
            @update:geo-location-value="selectedGeolocation = $event"
            @notify="showToast"
          />
        </RouterView>
      </Transition>

      <Transition name="toast-pop">
        <div v-if="toast.visible" :class="['toast', toast.type]">{{ toast.text }}</div>
      </Transition>

      <BottomNav v-if="!isDesktop" v-model="currentTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import HomeScreen from './components/HomeScreen.vue'
import CartScreen from './components/CartScreen.vue'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isWideDesktop = ref(window.innerWidth >= 1024)
const searchQuery = ref('')
const selectedAddress = ref('')
const selectedGeolocation = ref(null)
const addressFocusTrigger = ref(0)
const ADDRESS_STORAGE_KEY = 'selected_address'
const GEOLOCATION_STORAGE_KEY = 'selected_geolocation'
const handleResize = () => {
  isWideDesktop.value = window.innerWidth >= 1024
}
const toast = ref({
  visible: false,
  type: 'success',
  text: '',
})
let toastTimer = null

const routeToTabMap = {
  '/': 'home',
  '/cart': 'cart',
  '/profile': 'profile',
}
const tabToRouteMap = {
  home: '/',
  cart: '/cart',
  profile: '/profile',
}

const currentTab = computed({
  get: () => routeToTabMap[route.path] || 'home',
  set: (tab) => {
    const targetPath = tabToRouteMap[tab] || '/'
    if (route.path !== targetPath) router.push(targetPath)
  },
})

const showToast = ({ type = 'success', text }) => {
  toast.value = { visible: true, type, text }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.visible = false
  }, 2500)
}

const handleAddressClick = async () => {
  if (isWideDesktop.value) {
    if (currentTab.value !== 'home') {
      currentTab.value = 'home'
      await nextTick()
    }
    addressFocusTrigger.value += 1
    return
  }
  if (currentTab.value !== 'cart') {
    currentTab.value = 'cart'
    await nextTick()
  }
  addressFocusTrigger.value += 1
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  selectedAddress.value = localStorage.getItem(ADDRESS_STORAGE_KEY) || ''
  const cachedGeolocation = localStorage.getItem(GEOLOCATION_STORAGE_KEY)
  if (cachedGeolocation) {
    try {
      selectedGeolocation.value = JSON.parse(cachedGeolocation)
    } catch {
      selectedGeolocation.value = null
    }
  }
  authStore.initFromStorage()
  cartStore.loadCart(authStore.token)
})

watch(
  () => authStore.token,
  (token) => {
    if (!token) {
      selectedAddress.value = ''
      selectedGeolocation.value = null
    }
    cartStore.loadCart(token)
  },
)

watch(selectedAddress, (value) => {
  if (!value) {
    localStorage.removeItem(ADDRESS_STORAGE_KEY)
    return
  }
  localStorage.setItem(ADDRESS_STORAGE_KEY, value)
})

watch(
  () => authStore.user,
  (user) => {
    if (!user?.geolocation) return
    if (!selectedAddress.value && user.geolocation.address) {
      selectedAddress.value = user.geolocation.address
    }
    if (!selectedGeolocation.value && (user.geolocation.lat || user.geolocation.lng)) {
      selectedGeolocation.value = user.geolocation
    }
  },
  { immediate: true, deep: true },
)

watch(
  selectedGeolocation,
  (value) => {
    if (!value) {
      localStorage.removeItem(GEOLOCATION_STORAGE_KEY)
      return
    }
    localStorage.setItem(GEOLOCATION_STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
/* Глобальные стили для всего приложения. Без атрибута scoped! */
:root {
  --primary-dark: #4B3621;
  --primary-light: #AC7F5E;
  --text-main: #47423C;
  --bg-color: #FFFFFF;
  --bg-gray: #F0F0F0;
  --card-bg: #FEFEFE;
  --chip-bg: #F1EFE2;
  --chip-border: #DBD8C5;
}

html,
body {
  height: 100%;
  overflow: hidden;
  touch-action: manipulation;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;700&family=Manrope:wght@400;600;700&display=swap');

:root {
  --primary-dark: #4B3621;
  --primary-light: #AC7F5E;
  --text-main: #47423C;
  --bg-color: #FFFFFF;
  --bg-gray: #F0F0F0;
  --card-bg: #FEFEFE;
  --chip-bg: #F1EFE2;
  --chip-border: #DBD8C5;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-color);
  border-radius: 0;
  box-shadow: none;
  position: relative;
  overflow-x: hidden;
  font-family: 'Manrope', sans-serif;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
}

.main-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}


.toast {
  position: fixed;
  left: 16px;
  right: 16px;
  top: 86px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  z-index: 10;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
}

.toast.success {
  background: #2e7d32;
}

.toast.error {
  background: #c62828;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

.toast-pop-enter-active,
.toast-pop-leave-active {
  transition: all 0.28s ease;
}

.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (min-width: 769px) {
  :global(html),
  :global(body) {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-attachment: fixed;
  }

  :global(body) {
    background: #f7f5f2;
  }

  .app-container {
    max-width: 1460px;
    min-height: calc(100vh - 24px);
    margin: 12px auto;
    border-radius: 24px;
    box-shadow: 0 14px 34px rgba(75, 54, 33, 0.12);
    overflow: hidden;
    padding: 14px;
    background: #f7f5f2;
  }

  .main-interface {
    min-height: calc(100vh - 24px);
    height: calc(100vh - 24px);
    border-radius: 18px;
    overflow: hidden;
    background: #f7f5f2;
  }

  .desktop-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 16px;
    align-items: start;
    margin: 0;
    padding: 10px 12px 14px;
    width: 100%;
    overflow: hidden;
  }

  .desktop-home-wrap {
    min-width: 0;
  }

  .desktop-cart {
    min-width: 0;
  }

  .toast {
    top: auto;
    bottom: 30px;
    left: 30px;
    right: auto;
    width: max-content;
    max-width: 350px;
    z-index: 100;
  }

  .toast-pop-enter-from,
  .toast-pop-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
</style>