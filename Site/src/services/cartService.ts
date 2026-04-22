import { apiRequest } from './useApi'

export const getCartRequest = async (token: string) => {
  const response = await apiRequest('/cart', { token })
  return response.json()
}

export const addCartItemRequest = async (token: string, productId: number, quantity: number) => {
  await apiRequest('/cart', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
}

export const updateCartItemRequest = async (token: string, cartItemId: number, quantity: number) => {
  await apiRequest(`/cart/${cartItemId}`, {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
}

export const removeCartItemRequest = async (token: string, cartItemId: number) => {
  await apiRequest(`/cart/${cartItemId}`, {
    method: 'DELETE',
    token,
  })
}
