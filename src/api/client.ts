import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import type { ApiErrorResponse } from '@/types'

// Render free tier cold start can take 30-50s, so timeout must accommodate that
const COLD_START_TIMEOUT = 60000
// If a request hasn't resolved by this point, assume the server is waking up
const WAKING_UP_THRESHOLD = 4000

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: COLD_START_TIMEOUT,
})

// Extend the config type so we can stash a timer id per-request
interface ConfigWithTimer extends InternalAxiosRequestConfig {
    __wakeUpTimer?: ReturnType<typeof setTimeout>
}

// ── Request interceptor: attach token + start the "waking up" timer ──
apiClient.interceptors.request.use((config: ConfigWithTimer) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    config.__wakeUpTimer = setTimeout(() => {
        useUIStore.getState().setServerWakingUp(true)
    }, WAKING_UP_THRESHOLD)

    return config
})

// ── Response interceptor: clear timer, handle 401, normalize errors ──
apiClient.interceptors.response.use(
    (response) => {
        const config = response.config as ConfigWithTimer
        clearTimeout(config.__wakeUpTimer)
        useUIStore.getState().setServerWakingUp(false)
        return response
    },
    (error: AxiosError<ApiErrorResponse>) => {
        const config = error.config as ConfigWithTimer | undefined
        clearTimeout(config?.__wakeUpTimer)
        useUIStore.getState().setServerWakingUp(false)

        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
        }

        return Promise.reject(error)
    },
)

// Helper to pull a readable message out of any error thrown by apiClient
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.code === 'ECONNABORTED') {
            return 'The server took too long to respond. Please try again.'
        }
        return error.response?.data?.message ?? 'Something went wrong. Please try again.'
    }
    return 'An unexpected error occurred.'
}