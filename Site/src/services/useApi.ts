const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

type ApiRequestOptions = RequestInit & {
  token?: string
}

export const apiRequest = async (path: string, options: ApiRequestOptions = {}) => {
  const { token, headers, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response
}

export { API_BASE_URL }
