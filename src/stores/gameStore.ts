import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameConfig, GameSnapshot, PlayerConfig, PlayerId, TokenId } from '@/types'
import {
  advanceTurn,
  createGameSnapshot,
  createPlayersFromConfigs,
  getDefaultPlayerConfigs,
  getValidMoves,
  moveToken,
  pauseGame,
  resumeGame,
  rollForCurrentPlayer,
} from '@/core/game'
import { readStorage } from '@/utils/storage'

interface GameState {
  snapshot: GameSnapshot
  setupDraft: {
    playerCount: 2 | 3 | 4
    playerConfigs: PlayerConfig[]
    allowExtraTurnOnSix: boolean
    requireExactFinish: boolean
  }
  isRolling: boolean
  validMoves: TokenId[]
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
    consecutiveSixes: 0,
    sixesRolled: 0,
    tokensCaptured: 0,
  },
  winnerId: null,
  startedAt: null,
  pausedAt: null,
  finishedAt: null,
}

const defaultSetupDraft = {
  playerCount: 4 as const,
  playerConfigs: getDefaultPlayerConfigs(4),
  allowExtraTurnOnSix: true,
  requireExactFinish: true,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      snapshot: initialSnapshot,
      setupDraft: defaultSetupDraft,
      isRolling: false,
      validMoves: [],

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
        set({
          snapshot: createGameSnapshot(config),
          isRolling: false,
          validMoves: [],
        })
      },

      rollDice: () => {
        const { snapshot, isRolling } = get()
        if (isRolling || snapshot.phase !== 'playing') return

        set({ isRolling: true, validMoves: [] })
        setTimeout(() => {
          set((state) => {
            const nextSnapshot = rollForCurrentPlayer(state.snapshot)
            const currentPlayerId = nextSnapshot.board.currentPlayerId

            let moves: TokenId[] = []
            let finalSnapshot = nextSnapshot

            if (currentPlayerId && nextSnapshot.board.lastDiceRoll) {
              moves = getValidMoves(
                nextSnapshot,
                currentPlayerId,
                nextSnapshot.board.lastDiceRoll,
              )

              // If no valid moves, turn is skipped
              if (moves.length === 0) {
                finalSnapshot = advanceTurn(nextSnapshot)
              }
            }

            return {
              snapshot: finalSnapshot,
              isRolling: false,
              validMoves: moves,
            }
          })
        }, 400)
      },

      moveToken: (playerId, tokenId) => {
        const { snapshot } = get()
        const { snapshot: next, result } = moveToken(snapshot, playerId, tokenId)
        if (result.success) {
          set({ snapshot: next, validMoves: [] })
        }
      },

      pause: () => set((state) => ({ snapshot: pauseGame(state.snapshot) })),

      resume: () => set((state) => ({ snapshot: resumeGame(state.snapshot) })),

      resetGame: () => {
        const { snapshot } = get()
        if (!snapshot.config) {
          set({ snapshot: initialSnapshot, validMoves: [] })
          return
        }
        set({
          snapshot: createGameSnapshot(snapshot.config),
          isRolling: false,
          validMoves: [],
        })
      },

      abandonGame: () =>
        set({ snapshot: initialSnapshot, isRolling: false, validMoves: [] }),
    }),
    {
      name: 'ludo-game',
      partialize: (state) => ({
        snapshot: state.snapshot,
        setupDraft: state.setupDraft,
      }),
    },
  ),
)
