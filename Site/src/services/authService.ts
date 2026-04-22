import { apiRequest } from './useApi'

type AuthCredentials = {
  login: string
  password: string
}

type RegisterPayload = AuthCredentials & {
  firstName: string
}

type GeolocationPayload = {
  lat: number | null
  lng: number | null
  address: string
}

export const loginRequest = async (credentials: AuthCredentials) => {
  const response = await apiRequest('/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return response.json()
}

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await apiRequest('/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export const updateGeolocationRequest = async (token: string, payload: GeolocationPayload) => {
  const response = await apiRequest('/user/geolocation', {
    method: 'PATCH',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json()
}
