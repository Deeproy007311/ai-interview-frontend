import { create } from 'zustand'

interface UIState {
    isServerWakingUp: boolean
    setServerWakingUp: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    isServerWakingUp: false,
    setServerWakingUp: (value) => set({ isServerWakingUp: value }),
}))