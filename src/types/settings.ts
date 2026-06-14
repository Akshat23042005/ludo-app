export type SoundLevel = 'off' | 'low' | 'medium' | 'high'

export type ThemeMode = 'dark' | 'light' | 'system'

export interface AppSettings {
  soundLevel: SoundLevel
  musicEnabled: boolean
  hapticsEnabled: boolean
  themeMode: ThemeMode
  reducedMotion: boolean
  showTutorialHints: boolean
  playerName: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  soundLevel: 'medium',
  musicEnabled: true,
  hapticsEnabled: true,
  themeMode: 'dark',
  reducedMotion: false,
  showTutorialHints: true,
  playerName: 'Player',
}
