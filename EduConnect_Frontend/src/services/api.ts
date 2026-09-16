import axios, { AxiosError, AxiosInstance } from 'axios'

/**
 * Base API URL, configured per environment through VITE_API_URL:
 *   .env.development -> http://localhost:8080
 *   .env.production  -> https://api.kusmithasalveru.in
 */
export const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8080').replace(/\/+$/, '')

/** localStorage key holding the backend-issued JWT. Absent while running in offline/mock mode. */
export const TOKEN_KEY = 'educonnect_jwt_token'

/** Dispatched on window when the backend rejects the stored token, so the app can sign the user out. */
export const UNAUTHORIZED_EVENT = 'educonnect:unauthorized'

export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY)
}

/** Turns a backend-relative path such as `/uploads/x.png` into an absolute URL on the API host. */
export function toApiUrl(path: string): string {
    if (/^(https?:|data:|blob:)/i.test(path)) return path
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // Generous timeout: free-tier hosts can take up to a minute to wake the API after idle.
    timeout: 60000,
})

/** Attach the JWT to every request when one is stored. */
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/**
 * When a request that carried a token is rejected with 401, the token is expired or invalid:
 * drop it and let the app sign the user out. Auth endpoints are excluded so a wrong password
 * surfaces as a normal error instead.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status
        const url = error.config?.url ?? ''
        const sentToken = Boolean(error.config?.headers?.Authorization)
        if (status === 401 && sentToken && !url.includes('/api/auth/')) {
            clearAuthToken()
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }
        return Promise.reject(error)
    },
)

export default apiClient
