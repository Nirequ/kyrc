import { apiRequest } from './useApi'

export const getProductsRequest = async () => {
  const response = await apiRequest('/products')
  return response.json()
}
