import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types/settings'
import { readStorage, writeStorage } from '@/utils/storage'

interface SettingsState {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: readStorage('settings', DEFAULT_SETTINGS),
      updateSettings: (partial) =>
        set((state) => {
          const next = { ...state.settings, ...partial }
          writeStorage('settings', next)
          return { settings: next }
        }),
      resetSettings: () => {
        writeStorage('settings', DEFAULT_SETTINGS)
        set({ settings: DEFAULT_SETTINGS })
      },
    }),
    { name: 'ludo-settings' },
  ),
)
