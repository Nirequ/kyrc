<template>
  <main class="screen scrollable">
    <div class="desktop-home-layout">
      <aside class="categories">
        <button
          v-for="category in categoryOptions"
          :key="category.key"
          class="category-btn"
          :class="{ active: selectedCategory === category.key }"
          @click="selectedCategory = category.key"
        >
          {{ category.label }}
        </button>
      </aside>

      <section class="catalog-content">
        <div class="search-bar">
          <IconSearch class="search-icon" />
          <input v-model="searchQueryLocal" type="text" placeholder="Поиск" />
        </div>

        <div v-if="isLoading" class="skeleton-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card"></div>
        </div>
        <p v-else-if="errorMessage" class="state-text error-text">{{ errorMessage }}</p>

        <template v-else>
          <div class="catalog-section">
            <h3 class="section-title">Популярное</h3>
            <div class="product-grid">
              <div class="product-card" v-for="product in popularProducts" :key="product.id">
                <div class="product-image"><IconCupcake /></div>
                <div class="product-info">
                  <span class="product-price">{{ product.price }} ₽</span>
                  <span class="product-name">{{ product.name }}</span>
                </div>
                <div class="action-slot">
                  <Transition name="qty-fade" mode="out-in">
                    <div v-if="getCartQuantity(product.id) > 0" class="catalog-qty-control">
                      <button class="qty-btn" @click="changeQty(product, -1)">-</button>
                      <span class="qty-value">{{ getCartQuantity(product.id) }}</span>
                      <button class="qty-btn" @click="changeQty(product, 1)">+</button>
                    </div>
                    <button v-else class="add-btn" @click="addToCart(product)">
                      <svg class="add-icon" viewBox="4 4 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span class="add-label">Добавить</span>
                    </button>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

          <div class="catalog-section" v-if="newProducts.length">
            <h3 class="section-title">Новинки</h3>
            <div class="product-grid compact-grid">
              <div class="product-card" v-for="product in newProducts" :key="`new-${product.id}`">
                <div class="product-image"><IconCupcake /></div>
                <div class="product-info">
                  <span class="product-price">{{ product.price }} ₽</span>
                  <span class="product-name">{{ product.name }}</span>
                </div>
                <div class="action-slot">
                  <Transition name="qty-fade" mode="out-in">
                    <div v-if="getCartQuantity(product.id) > 0" class="catalog-qty-control">
                      <button class="qty-btn" @click="changeQty(product, -1)">-</button>
                      <span class="qty-value">{{ getCartQuantity(product.id) }}</span>
                      <button class="qty-btn" @click="changeQty(product, 1)">+</button>
                    </div>
                    <button v-else class="add-btn" @click="addToCart(product)">
                      <svg class="add-icon" viewBox="4 4 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span class="add-label">Добавить</span>
                    </button>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import IconSearch from './icons/IconSearch.vue'
import IconCupcake from './icons/IconCupcake.vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { getProductsRequest } from '../services/productService'

const emit = defineEmits(['notify'])
const props = defineProps({
  searchQuery: { type: String, default: '' },
})
const authStore = useAuthStore()
const cartStore = useCartStore()

const searchQueryLocal = ref('')
const products = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedCategory = ref('all')
const categoryOptions = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новинки недели' },
  { key: 'cakes', label: 'Торты и бенто' },
  { key: 'eclairs', label: 'Эклеры' },
]

const normalizeCategory = (value = '') => String(value).trim().toLowerCase()

const detectCategoryFromName = (name = '') => {
  const normalizedName = normalizeCategory(name)
  if (
    normalizedName.includes('торт') ||
    normalizedName.includes('бенто') ||
    normalizedName.includes('cake')
  ) {
    return 'cakes'
  }
  if (normalizedName.includes('эклер') || normalizedName.includes('eclair')) {
    return 'eclairs'
  }
  return ''
}

const resolveCategoryKey = (product) => {
  const rawCategory = normalizeCategory(product.category || product.type || product.group)
  if (
    rawCategory.includes('new') ||
    rawCategory.includes('новин') ||
    rawCategory.includes('новое') ||
    rawCategory.includes('недел')
  ) {
    return 'new'
  }
  if (
    rawCategory.includes('торт') ||
    rawCategory.includes('бенто') ||
    rawCategory.includes('cake')
  ) {
    return 'cakes'
  }
  if (rawCategory.includes('эклер') || rawCategory.includes('eclair')) {
    return 'eclairs'
  }
  return detectCategoryFromName(product.name)
}

const filteredProducts = computed(() => {
  const query = (props.searchQuery || searchQueryLocal.value).trim().toLowerCase()
  return products.value.filter((product) => {
    const bySearch = !query || product.name.toLowerCase().includes(query)
    const categoryKey = resolveCategoryKey(product)
    const byCategory =
      selectedCategory.value === 'all' || categoryKey === selectedCategory.value
    return bySearch && byCategory
  })
})
const popularProducts = computed(() => filteredProducts.value.slice(0, 8))
const newProducts = computed(() => filteredProducts.value.slice(8, 14))

const getCartItemByProductId = (productId) =>
  cartStore.items.find((item) => item.productId === productId)
const getCartQuantity = (productId) => getCartItemByProductId(productId)?.quantity || 0

const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await getProductsRequest()
    products.value = data.map((item) => ({
      id: item.id,
      name: item.name || item.title || `Товар #${item.id}`,
      price: Number(item.price || item.cost || 0),
      category: item.category || item.type || item.group || '',
    }))
  } catch (error) {
    errorMessage.value = 'Не удалось загрузить товары из API'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const addToCart = async (product) => {
  if (!authStore.token) {
    emit('notify', { type: 'error', text: 'Сначала войдите в профиль' })
    return
  }
  try {
    await cartStore.addToCart(authStore.token, product.id, 1)
    emit('notify', { type: 'success', text: `Добавлено в корзину: ${product.name}` })
  } catch (error) {
    errorMessage.value = 'Не удалось добавить товар в корзину'
    emit('notify', { type: 'error', text: 'Не удалось добавить товар в корзину' })
    console.error(error)
  }
}

const changeQty = (product, delta) => {
  const cartItem = getCartItemByProductId(product.id)
  if (!cartItem && delta > 0) {
    addToCart(product)
    return
  }
  if (!cartItem) return
  if (!authStore.token) return
  cartStore
    .changeQuantity(authStore.token, cartItem.id, cartItem.quantity + delta)
    .catch(() => emit('notify', { type: 'error', text: 'Не удалось изменить количество' }))
}

onMounted(fetchProducts)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');

:root { --primary-dark: #4B3621; --text-main: #47423C; --bg-gray: #F0F0F0; --chip-bg: #F1EFE2; --chip-border: #DBD8C5; }
.screen { flex: 1; display: flex; flex-direction: column; position: relative; }
.desktop-home-layout { display: block; }
.scrollable { overflow-y: auto; padding-bottom: 90px; }
.search-bar { margin: 20px; background: var(--bg-gray); border-radius: 16px; display: flex; align-items: center; padding: 10px 15px; }
.search-icon { font-size: 20px; color: var(--text-main); display: flex; align-items: center; }
.search-bar input { border: none; background: transparent; width: 100%; font-size: 20px; font-family: 'Manrope'; outline: none; margin-left: 10px; }
.state-text { margin: 12px 20px 0; font-size: 14px; }
.error-text { color: #b00020; }
.categories { display: flex; gap: 10px; padding: 0 20px; overflow-x: auto; scrollbar-width: none; }
.category-btn { white-space: nowrap; flex-shrink: 0; background: var(--chip-bg); border: 1px solid var(--chip-border); border-radius: 24px; padding: 8px 16px; font-size: 16px; color: var(--text-main); cursor: pointer; font-family: 'Manrope'; }
.category-btn.active { background: var(--primary-dark); color: white; border-color: var(--primary-dark); }
.skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; }
.skeleton-card { height: 188px; border-radius: 26px; background: linear-gradient(90deg, #f2f2f2 25%, #ececec 50%, #f2f2f2 75%); background-size: 220% 100%; animation: shimmer 1.4s infinite linear; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -20% 0; } }
.catalog-section { padding: 0 20px 18px; }
.section-title { margin: 0 0 12px; font-size: 26px; font-weight: 700; color: var(--text-main); }
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.compact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.product-card { background: white; border-radius: 18px; border: 1px solid #ece6de; overflow: hidden; display: flex; flex-direction: column; padding: 10px; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.product-image { aspect-ratio: 1; border-radius: 18px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; font-size: 50px; color: var(--primary-dark); }
.product-info { padding: 10px 4px; display: flex; flex-direction: column; gap: 4px; }
.product-name { font-size: 14px; }
.product-price { font-weight: 700; font-size: 18px; }
.action-slot { width: 100%; min-height: 38px; display: flex; align-items: center; }
.add-btn { background: #f3e8d8; border: none; border-radius: 10px; width: 100%; height: 34px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; color: var(--primary-dark); transition: transform 0.3s ease, opacity 0.3s ease; }
.add-btn:active { transform: scale(0.95); opacity: 0.85; }
.add-icon { width: 14px; height: 14px; }
.add-label { font-size: 14px; font-weight: 700; }
.catalog-qty-control { display: flex; align-items: center; justify-content: space-between; width: 100%; background: #f3e8d8; border-radius: 10px; padding: 2px 5px; min-height: 34px; }
.qty-btn { border: none; width: 26px; height: 26px; border-radius: 9px; background: var(--primary-dark); color: #fff; cursor: pointer; transition: transform 0.3s ease, opacity 0.3s ease; }
.qty-btn:active { transform: scale(0.95); opacity: 0.85; }
.qty-value { min-width: 24px; text-align: center; font-weight: 700; }
.qty-fade-enter-active, .qty-fade-leave-active { transition: all 0.24s ease; }
.qty-fade-enter-from, .qty-fade-leave-to { opacity: 0; transform: scale(0.94); }
@media (min-width: 769px) {
  .product-grid, .skeleton-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }
}
@media (min-width: 1024px) {
  .desktop-home-layout { display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: start; }
  .categories { position: sticky; top: 96px; overflow: visible; flex-direction: column; gap: 4px; padding: 10px; background: #fff; border: 1px solid #ece6de; border-radius: 16px; }
  .category-btn { width: 100%; text-align: left; border: none; background: transparent; border-radius: 10px; padding: 8px 10px; font-size: 14px; }
  .category-btn:hover, .category-btn.active { background: rgba(172, 127, 94, 0.2); color: var(--primary-dark); }
  .search-bar { display: none; }
  .catalog-content { min-width: 0; }
  .catalog-section { padding: 0 0 16px; }
  .section-title { font-size: 24px; margin-bottom: 10px; }
  .product-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .compact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 50%; }
  .skeleton-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 0; }
}
</style>
