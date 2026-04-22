<template>
  <header class="header" :class="{ 'shadow-header': shadow }">
    <button class="logo" @click="$emit('navigate', 'home')">
      <IconCupcake class="logo-icon" />
      <h1>CRUMBS</h1>
    </button>
    <div class="desktop-search">
      <input
        :value="searchQuery"
        type="text"
        placeholder="Поиск по каталогу"
        @input="$emit('update:search-query', $event.target.value)"
      />
    </div>
    <nav class="desktop-nav">
      <button class="desktop-location" @click="$emit('address-click')">
        <svg class="desktop-location-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"></path>
        </svg>
        <span>{{ selectedAddress || 'Адрес' }}</span>
      </button>
      <button
        class="desktop-nav-item"
        :class="{ active: currentTab === 'profile' }"
        @click="$emit('navigate', 'profile')"
      >
        <svg class="desktop-nav-icon" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><path d="M17.5,16.383a8.067,8.067,0,1,1,8.067-8.067A8.076,8.076,0,0,1,17.5,16.383Zm0-13.633a5.567,5.567,0,1,0,5.567,5.566A5.573,5.573,0,0,0,17.5,2.75Z" fill="currentColor"></path><path d="M31.477,34.75a1.25,1.25,0,0,1-1.23-1.037A12.663,12.663,0,0,0,17.5,22.852,12.663,12.663,0,0,0,4.753,33.713a1.25,1.25,0,0,1-2.464-.426A15.1,15.1,0,0,1,17.5,20.352,15.1,15.1,0,0,1,32.711,33.287a1.25,1.25,0,0,1-1.02,1.444A1.2,1.2,0,0,1,31.477,34.75Z" fill="currentColor"></path></svg>
        <span>{{ isAuthorized ? 'Профиль' : 'Войти' }}</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import IconCupcake from './icons/IconCupcake.vue'

defineProps({
  shadow: {
    type: Boolean,
    default: false
  },
  currentTab: {
    type: String,
    default: 'home'
  },
  isAuthorized: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedAddress: {
    type: String,
    default: ''
  }
})

defineEmits(['navigate', 'update:search-query', 'address-click'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;700&display=swap');

:root {
  --primary-dark: #4B3621;
  --bg-color: #FFFFFF;
}

.header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  z-index: 10;
  position: relative;
}

.shadow-header {
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.desktop-search,
.desktop-nav {
  display: none;
}

.logo h1 {
  font-family: 'Inria Serif', serif;
  font-size: 24px;
  color: var(--primary-dark);
  margin: 0;
  line-height: 1;
}

.logo-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: var(--primary-dark);
}

@media (min-width: 769px) {
  .header {
    height: 86px;
    position: sticky;
    top: 0;
    z-index: 100;
    justify-content: space-between;
    padding: 0 8px;
  }

  .logo {
    min-width: 190px;
  }

  .desktop-search {
    display: flex;
    justify-content: center;
    flex: 1;
    padding: 0 24px;
  }

  .desktop-search input {
    width: 100%;
    max-width: 520px;
    border: 1px solid #e5ddd2;
    border-radius: 14px;
    padding: 12px 14px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    background: #fbfaf8;
    color: var(--text-main);
    outline: none;
  }

  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 280px;
    justify-content: flex-end;
  }

  .desktop-location {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fbfaf8;
    border: 1px solid #e5ddd2;
    border-radius: 12px;
    padding: 8px 10px;
    color: var(--text-main);
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #e5ddd2;
    cursor: pointer;
    max-width: 180px;
  }

  .desktop-location span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desktop-location-icon {
    width: 14px;
    height: 14px;
    color: var(--primary-dark);
  }

  .desktop-nav-item {
    border: none;
    background: transparent;
    color: var(--text-main);
    border-radius: 10px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    transition: background-color 0.25s ease, color 0.25s ease, opacity 0.25s ease;
  }

  .desktop-nav-item:hover {
    background: rgba(75, 54, 33, 0.1);
    color: var(--primary-dark);
  }

  .desktop-nav-item.active {
    color: var(--primary-dark);
  }

  .desktop-nav-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
