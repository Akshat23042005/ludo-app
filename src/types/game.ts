import type { Player, PlayerColor, PlayerId } from './player'

export type GamePhase = 'idle' | 'setup' | 'playing' | 'paused' | 'finished'

export type GameMode = 'local' | 'online'

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

export type TokenId = 0 | 1 | 2 | 3

export interface TokenState {
  id: TokenId
  position: number
  isHome: boolean
  isFinished: boolean
}

export interface BoardState {
  players: Record<PlayerId, TokenState[]>
  currentPlayerId: PlayerId | null
  lastDiceRoll: DiceValue | null
  turnNumber: number
}

export interface GameConfig {
  mode: GameMode
  playerCount: 2 | 3 | 4
  players: Player[]
  allowExtraTurnOnSix: boolean
  requireExactFinish: boolean
}

export interface GameSnapshot {
  phase: GamePhase
  config: GameConfig | null
  board: BoardState
  winnerId: PlayerId | null
  startedAt: number | null
  pausedAt: number | null
  finishedAt: number | null
}

export interface MoveResult {
  success: boolean
  message: string
  captured?: boolean
  extraTurn?: boolean
}

export const PLAYER_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue']

export const TOKENS_PER_PLAYER = 4

export const MAIN_TRACK_LENGTH = 52
