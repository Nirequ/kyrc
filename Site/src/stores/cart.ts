import { defineStore } from 'pinia'
import {
  addCartItemRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '../services/cartService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<Record<string, any>>,
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
  },
  actions: {
    reset() {
      this.items = []
    },
    async loadCart(token: string) {
      if (!token) {
        this.items = []
        return true
      }
      try {
        this.items = await getCartRequest(token)
        return true
      } catch {
        return false
      }
    },
    async addToCart(token: string, productId: number, quantity = 1) {
      await addCartItemRequest(token, productId, quantity)
      await this.loadCart(token)
    },
    async removeItem(token: string, cartItemId: number) {
      await removeCartItemRequest(token, cartItemId)
      await this.loadCart(token)
    },
    async changeQuantity(token: string, cartItemId: number, nextQuantity: number) {
      if (nextQuantity <= 0) {
        await this.removeItem(token, cartItemId)
        return
      }
      await updateCartItemRequest(token, cartItemId, nextQuantity)
      await this.loadCart(token)
    },
  },
})
