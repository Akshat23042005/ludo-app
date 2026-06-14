import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { themeTokens } from './tokens'
import { useSettingsStore } from '@/stores/settingsStore'

interface ThemeContextValue {
  tokens: typeof themeTokens
  resolvedMode: 'dark' | 'light'
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useSettingsStore((s) => s.settings.themeMode)

  const resolvedMode = useMemo<'dark' | 'light'>(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    }
    return themeMode
  }, [themeMode])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedMode
  }, [resolvedMode])

  const value = useMemo(
    () => ({ tokens: themeTokens, resolvedMode }),
    [resolvedMode],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
