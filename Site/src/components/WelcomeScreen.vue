<template>
  <main class="screen welcome-screen">
    <header class="header">
      <div class="logo">
        <IconCupcake class="logo-icon" />
        <h1>CRUMBS</h1>
      </div>
    </header>
    <div class="welcome-content">
      <h2>Ваш идеальный десерт уже здесь</h2>
    </div>
    <div class="bottom-action">
      <button class="primary-btn" @click="$emit('start')">Начать покупки</button>
    </div>
  </main>
</template>

<script setup>
import IconCupcake from './icons/IconCupcake.vue'
defineEmits(['start'])
</script>

<style scoped>
/* Шрифты */
@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;700&family=Manrope:wght@400;600;700&display=swap');

:root {
  --primary-dark: #4B3621;
  --primary-light: #AC7F5E;
  --text-main: #47423C;
  --bg-color: #FFFFFF;
}

.screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header {
  height: 106px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  background: var(--bg-color);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo h1 {
  font-family: 'Inria Serif', serif;
  font-size: 36px;
  color: var(--primary-dark);
  margin: 0;
  line-height: 1;
}

.logo-icon {
  font-size: 32px;
  width: 32px;
  height: 32px;
  color: var(--primary-dark);
}

.welcome-screen {
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.welcome-content h2 {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  color: #000;
  line-height: 1.3;
  margin-top: 40px;
}

.bottom-action {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 40px;
  display: flex;
  justify-content: center;
  padding: 0 32px;
}

.primary-btn {
  background: var(--primary-dark);
  color: white;
  width: 100%;
  height: 53px;
  border-radius: 21px;
  font-family: 'Manrope';
  font-weight: 600;
  font-size: 24px;
  border: none;
  box-shadow: 0px 4px 6.6px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
