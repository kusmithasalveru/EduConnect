import type { AppState } from './types'

const STORAGE_KEY = 'educonnect_state_v1'

export function loadAppState(): AppState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as AppState
    } catch {
        return null
    }
}

export function saveAppState(state: AppState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
        // ignore
    }
}

