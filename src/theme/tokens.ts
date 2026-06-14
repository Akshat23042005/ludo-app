export const themeTokens = {
  colors: {
    charcoal: '#1a1f24',
    charcoalLight: '#252b32',
    slate: '#3d4f5f',
    slateMuted: '#5a6b7a',
    offWhite: '#f5f3ef',
    cream: '#ebe8e2',
    teal: '#0d4f4f',
    tealLight: '#1a6b6b',
    tealMuted: '#2a8585',
    gold: '#b8956c',
    goldLight: '#c4a574',
    goldMuted: '#9a7d5a',
  },
  motion: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    spring: { type: 'spring' as const, stiffness: 400, damping: 30 },
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
  radius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
} as const

export type ThemeTokens = typeof themeTokens
