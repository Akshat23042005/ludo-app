import { create } from 'zustand'

interface UIState {
  isNavOpen: boolean
  isPauseOpen: boolean
  splashComplete: boolean
  activeModal: string | null
  toggleNav: () => void
  closeNav: () => void
  openPause: () => void
  closePause: () => void
  completeSplash: () => void
  openModal: (id: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isNavOpen: false,
  isPauseOpen: false,
  splashComplete: false,
  activeModal: null,

  toggleNav: () => set((s) => ({ isNavOpen: !s.isNavOpen })),
  closeNav: () => set({ isNavOpen: false }),
  openPause: () => set({ isPauseOpen: true }),
  closePause: () => set({ isPauseOpen: false }),
  completeSplash: () => set({ splashComplete: true }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}))
