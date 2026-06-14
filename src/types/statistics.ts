import type { PlayerColor } from './player'

export interface PlayerStatistics {
  gamesPlayed: number
  gamesWon: number
  tokensCaptured: number
  sixesRolled: number
  favoriteColor: PlayerColor | null
}

export interface MatchRecord {
  id: string
  playedAt: number
  playerCount: number
  winnerName: string
  winnerColor: PlayerColor
  durationMs: number
  turns: number
}

export interface GameStatistics {
  lifetime: PlayerStatistics
  recentMatches: MatchRecord[]
}

export const DEFAULT_STATISTICS: GameStatistics = {
  lifetime: {
    gamesPlayed: 0,
    gamesWon: 0,
    tokensCaptured: 0,
    sixesRolled: 0,
    favoriteColor: null,
  },
  recentMatches: [],
}
