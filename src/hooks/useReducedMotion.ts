import { useSettingsStore } from '@/stores/settingsStore'

export function useReducedMotion(): boolean {
  const reducedMotion = useSettingsStore((s) => s.settings.reducedMotion)

  if (typeof window === 'undefined') return reducedMotion

  return (
    reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
