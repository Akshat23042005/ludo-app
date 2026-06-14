import { create } from 'zustand'
import type { GameConfig, GameSnapshot, PlayerConfig } from '@/types'
import {
  createGameSnapshot,
  createPlayersFromConfigs,
  getDefaultPlayerConfigs,
  moveToken,
  pauseGame,
  resumeGame,
  rollForCurrentPlayer,
} from '@/core/game'
import type { PlayerId, TokenId } from '@/types'

interface GameState {
  snapshot: GameSnapshot
  setupDraft: {
    playerCount: 2 | 3 | 4
    playerConfigs: PlayerConfig[]
    allowExtraTurnOnSix: boolean
    requireExactFinish: boolean
  }
  isRolling: boolean
  setPlayerCount: (count: 2 | 3 | 4) => void
  updatePlayerConfig: (index: number, config: Partial<PlayerConfig>) => void
  setSetupOption: (
    key: 'allowExtraTurnOnSix' | 'requireExactFinish',
    value: boolean,
  ) => void
  startGame: () => void
  rollDice: () => void
  moveToken: (playerId: PlayerId, tokenId: TokenId) => void
  pause: () => void
  resume: () => void
  resetGame: () => void
  abandonGame: () => void
}

const initialSnapshot: GameSnapshot = {
  phase: 'idle',
  config: null,
  board: {
    players: {},
    currentPlayerId: null,
    lastDiceRoll: null,
    turnNumber: 0,
  },
  winnerId: null,
  startedAt: null,
  pausedAt: null,
  finishedAt: null,
}

export const useGameStore = create<GameState>((set, get) => ({
  snapshot: initialSnapshot,
  setupDraft: {
    playerCount: 4,
    playerConfigs: getDefaultPlayerConfigs(4),
    allowExtraTurnOnSix: true,
    requireExactFinish: true,
  },
  isRolling: false,

  setPlayerCount: (count) =>
    set({
      setupDraft: {
        ...get().setupDraft,
        playerCount: count,
        playerConfigs: getDefaultPlayerConfigs(count),
      },
    }),

  updatePlayerConfig: (index, config) =>
    set((state) => ({
      setupDraft: {
        ...state.setupDraft,
        playerConfigs: state.setupDraft.playerConfigs.map((p, i) =>
          i === index ? { ...p, ...config } : p,
        ),
      },
    })),

  setSetupOption: (key, value) =>
    set((state) => ({
      setupDraft: { ...state.setupDraft, [key]: value },
    })),

  startGame: () => {
    const { setupDraft } = get()
    const players = createPlayersFromConfigs(setupDraft.playerConfigs)
    const config: GameConfig = {
      mode: 'local',
      playerCount: setupDraft.playerCount,
      players,
      allowExtraTurnOnSix: setupDraft.allowExtraTurnOnSix,
      requireExactFinish: setupDraft.requireExactFinish,
    }
    set({ snapshot: createGameSnapshot(config), isRolling: false })
  },

  rollDice: () => {
    const { snapshot, isRolling } = get()
    if (isRolling || snapshot.phase !== 'playing') return

    set({ isRolling: true })
    setTimeout(() => {
      set((state) => ({
        snapshot: rollForCurrentPlayer(state.snapshot),
        isRolling: false,
      }))
    }, 400)
  },

  moveToken: (playerId, tokenId) => {
    const { snapshot } = get()
    const { snapshot: next, result } = moveToken(snapshot, playerId, tokenId)
    if (result.success) {
      set({ snapshot: next })
    }
  },

  pause: () =>
    set((state) => ({ snapshot: pauseGame(state.snapshot) })),

  resume: () =>
    set((state) => ({ snapshot: resumeGame(state.snapshot) })),

  resetGame: () => {
    const { snapshot } = get()
    if (!snapshot.config) {
      set({ snapshot: initialSnapshot })
      return
    }
    set({ snapshot: createGameSnapshot(snapshot.config), isRolling: false })
  },

  abandonGame: () => set({ snapshot: initialSnapshot, isRolling: false }),
}))
