export const BASE_URL = process.env.NEXT_PUPLIC_API_HOST || 'http://localhost:3001/api'

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  }
}
