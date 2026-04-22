<template>
  <main class="screen scrollable cart-screen">
    <div class="address-card">
      <div class="address-autocomplete">
        <input
          ref="addressInputRef"
          v-model="addressQuery"
          class="address-input"
          type="text"
          placeholder="Начните вводить адрес (напр. Москва, Ленина...)"
          @input="handleAddressInput"
          @focus="showSuggestions = true"
        />
        <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
          <li
            v-for="suggestion in suggestions"
            :key="suggestion.value"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.value }}
          </li>
        </ul>
      </div>
    </div>

    <div class="order-info-card">
      <h3>Информация о заказе</h3>
      <p v-if="!authStore.isAuthorized" class="empty-text">Войдите в аккаунт, чтобы видеть корзину</p>
      <TransitionGroup name="cart-item" tag="div">
        <div v-for="item in cartStore.items" :key="item.id" class="order-item">
          <div class="item-img"><IconCupcake /></div>
          <span class="item-name">{{ item.name }}</span>
          <div class="qty-control">
            <button class="qty-btn" @click="changeQty(item, -1)">-</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button class="qty-btn" @click="changeQty(item, 1)">+</button>
          </div>
          <span class="item-price">{{ item.price * item.quantity }} ₽</span>
        </div>
      </TransitionGroup>
      <div v-if="authStore.isAuthorized && !cartStore.items.length" class="empty-state">
        <IconCupcake class="empty-icon" />
        <p class="empty-title">В корзине пусто</p>
        <button class="catalog-btn" @click="goCatalog">В каталог</button>
      </div>
    </div>
    <div v-if="authStore.isAuthorized && cartStore.items.length" class="checkout-bar">
      <button class="checkout-btn">Заказать <span>{{ cartStore.totalPrice }} ₽</span></button>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import IconCupcake from './icons/IconCupcake.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const DADATA_API_KEY = '175d6ba87c071b83d55c5cb7a20f26b002f9bd43'

const props = defineProps({
  addressValue: {
    type: String,
    default: '',
  },
  geoLocationValue: {
    type: Object,
    default: null,
  },
  focusTrigger: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['notify', 'update:address-value', 'update:geo-location-value'])
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const addressInputRef = ref(null)
const addressQuery = ref(props.addressValue || '')
const geolocation = ref(props.geoLocationValue || null)
const suggestions = ref([])
const showSuggestions = ref(false)
let addressDebounceTimer = null

const fetchAddressSuggestions = async (query) => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    suggestions.value = []
    return
  }

  try {
    const response = await fetch(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${DADATA_API_KEY}`,
        },
        body: JSON.stringify({ query: trimmedQuery, count: 6 }),
      },
    )
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    suggestions.value = data.suggestions || []
  } catch {
    suggestions.value = []
  }
}

const handleAddressInput = () => {
  if (addressDebounceTimer) clearTimeout(addressDebounceTimer)
  addressDebounceTimer = setTimeout(() => {
    fetchAddressSuggestions(addressQuery.value)
  }, 300)
}

const saveGeolocation = async (payload) => {
  geolocation.value = payload
  emit('update:geo-location-value', payload)
  if (!authStore.isAuthorized) return
  const isSaved = await authStore.saveGeolocation(payload)
  if (!isSaved) {
    emit('notify', { type: 'error', text: 'Не удалось сохранить геолокацию' })
  }
}

const selectSuggestion = async (suggestion) => {
  addressQuery.value = suggestion.value
  suggestions.value = []
  showSuggestions.value = false
  await saveGeolocation({
    lat: suggestion.data?.geo_lat ? Number(suggestion.data.geo_lat) : null,
    lng: suggestion.data?.geo_lon ? Number(suggestion.data.geo_lon) : null,
    address: suggestion.value,
  })
}

watch(
  () => props.addressValue,
  (value) => {
    if (value !== addressQuery.value) {
      addressQuery.value = value || ''
    }
  },
)

watch(
  () => props.geoLocationValue,
  (value) => {
    geolocation.value = value || null
  },
)

watch(addressQuery, (value) => {
  emit('update:address-value', value)
})

watch(
  () => props.focusTrigger,
  async () => {
    await nextTick()
    if (!addressInputRef.value) return
    if (window.innerWidth >= 1024) {
      addressInputRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    addressInputRef.value.focus()
  },
)

const goCatalog = () => {
  router.push('/')
}

const changeQty = async (item, delta) => {
  if (!authStore.token) return
  try {
    await cartStore.changeQuantity(authStore.token, item.id, item.quantity + delta)
  } catch {
    emit('notify', { type: 'error', text: 'Не удалось изменить количество' })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');

:root {
  --card-bg: #FEFEFE;
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

.cart-screen {
  padding: 20px;
  background: #fcfcfc;
}

.address-card, .order-info-card {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0px 6px 5px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 20px;
}

.address-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-autocomplete {
  position: relative;
  width: 100%;
  z-index: 30;
}

.address-input {
  background: #f3f3f3;
  border: 1px solid #e7e1d7;
  border-radius: 14px;
  padding: 12px 14px;
  border: none;
  width: 100%;
  font-size: 14px;
  font-family: 'Manrope';
  background: #f8f6f2;
  outline: none;
}

.suggestions-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 120;
  list-style: none;
  margin: 0;
  padding: 6px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 220px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.25;
}

.suggestion-item:hover {
  background: var(--chip-bg);
}

.order-info-card h3 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 15px;
  font-family: 'Manrope';
  font-weight: 600;
}

.order-item {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto auto;
  column-gap: 10px;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  font-family: 'Manrope';
}

.item-img {
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
  color: var(--primary-dark);
}

.item-name {
  min-width: 0;
  line-height: 1.2;
  word-break: break-word;
}

.item-price {
  font-weight: 700;
  min-width: 54px;
  text-align: right;
  white-space: nowrap;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 110px;
  justify-content: center;
  flex-shrink: 0;
}

.qty-btn {
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ede8e1;
  color: var(--primary-dark);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
}

.qty-btn:active {
  transform: scale(0.95);
  opacity: 0.85;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 700;
}

.empty-text {
  margin: 0;
  color: #777;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 0 10px;
}

.empty-icon {
  width: 42px;
  height: 42px;
  color: var(--primary-dark);
  opacity: 0.75;
}

.empty-title {
  margin: 0;
  font-size: 15px;
  color: #767676;
}

.catalog-btn {
  border: none;
  border-radius: 14px;
  background: var(--primary-dark);
  color: #fff;
  padding: 9px 16px;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.catalog-btn:active {
  transform: scale(0.95);
  opacity: 0.85;
}

.checkout-bar {
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top, rgba(252, 252, 252, 1), rgba(252, 252, 252, 0.9));
  padding-top: 10px;
}

.checkout-btn {
  width: 100%;
  border: none;
  border-radius: 14px;
  height: 46px;
  background: var(--primary-dark);
  color: #fff;
  font-weight: 700;
  font-family: 'Manrope';
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.35s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(70px);
}

@media (min-width: 1024px) {
  .cart-screen {
    position: sticky;
    top: 96px;
    height: calc(100vh - 130px);
    background: #fff;
    border-radius: 16px;
    box-shadow: none;
    border: 1px solid #ece6de;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .address-card {
    margin: 0;
    padding: 10px;
    border: 1px solid #ece6de;
    box-shadow: none;
    border-radius: 12px;
    flex-shrink: 0;
    position: relative;
    z-index: 40;
  }

  .address-input {
    height: 36px;
    padding: 8px 10px;
    font-size: 12px;
    border-radius: 10px;
  }

  .order-info-card {
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .order-info-card h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .order-item {
    border: 1px solid #ece6de;
    box-shadow: none;
    border-radius: 12px;
    margin-bottom: 10px;
    grid-template-columns: 34px minmax(0, 1fr) 92px 56px;
    column-gap: 8px;
    padding: 10px 8px;
  }

  .item-img {
    width: 34px;
    height: 34px;
    margin-right: 0;
    font-size: 16px;
  }

  .item-name {
    font-size: 13px;
  }

  .qty-control {
    width: 92px;
    gap: 4px;
  }

  .qty-btn {
    width: 24px;
    height: 24px;
  }

  .item-price {
    min-width: 56px;
    font-size: 15px;
  }

  .empty-state {
    justify-content: center;
    min-height: 360px;
    text-align: center;
    gap: 10px;
  }

  .empty-icon {
    width: 52px;
    height: 52px;
    opacity: 0.5;
  }

  .catalog-btn {
    background: #f3f3f3;
    color: #8c8782;
    border-radius: 12px;
    width: 100%;
    max-width: 220px;
  }
}
</style>