import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '../components/HomeScreen.vue'
import CartScreen from '../components/CartScreen.vue'
import ProfileScreen from '../components/ProfileScreen.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeScreen },
    { path: '/cart', name: 'cart', component: CartScreen },
    { path: '/profile', name: 'profile', component: ProfileScreen },
  ],
})

export default router
