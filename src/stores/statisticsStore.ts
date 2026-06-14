import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameStatistics, MatchRecord, PlayerColor } from '@/types'
import { DEFAULT_STATISTICS } from '@/types/statistics'
import { generateId } from '@/utils/helpers'
import { readStorage, writeStorage } from '@/utils/storage'

interface StatisticsState {
  statistics: GameStatistics
  recordMatch: (params: {
    playerCount: number
    winnerName: string
    winnerColor: PlayerColor
    durationMs: number
    turns: number
    didWin: boolean
    sixesRolled: number
    tokensCaptured: number
  }) => void
  resetStatistics: () => void
}

const MAX_RECENT_MATCHES = 20

export const useStatisticsStore = create<StatisticsState>()(
  persist(
    (set) => ({
      statistics: readStorage('statistics', DEFAULT_STATISTICS),
      recordMatch: ({
        playerCount,
        winnerName,
        winnerColor,
        durationMs,
        turns,
        didWin,
        sixesRolled,
        tokensCaptured,
      }) =>
        set((state) => {
          const record: MatchRecord = {
            id: generateId(),
            playedAt: Date.now(),
            playerCount,
            winnerName,
            winnerColor,
            durationMs,
            turns,
          }

          const recentMatches = [record, ...state.statistics.recentMatches].slice(
            0,
            MAX_RECENT_MATCHES,
          )

          const next: GameStatistics = {
            lifetime: {
              gamesPlayed: state.statistics.lifetime.gamesPlayed + 1,
              gamesWon: state.statistics.lifetime.gamesWon + (didWin ? 1 : 0),
              tokensCaptured:
                state.statistics.lifetime.tokensCaptured + tokensCaptured,
              sixesRolled: state.statistics.lifetime.sixesRolled + sixesRolled,
              favoriteColor: winnerColor,
            },
            recentMatches,
          }

          writeStorage('statistics', next)
          return { statistics: next }
        }),
      resetStatistics: () => {
        writeStorage('statistics', DEFAULT_STATISTICS)
        set({ statistics: DEFAULT_STATISTICS })
      },
    }),
    { name: 'ludo-statistics' },
  ),
)
