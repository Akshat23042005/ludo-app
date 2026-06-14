import type { PlayerColor, PlayerId } from './player'

export type GamePhase = 'idle' | 'setup' | 'playing' | 'paused' | 'finished'
export type GameMode = 'local' | 'online'
export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6
export type TokenId = 0 | 1 | 2 | 3

export interface TokenState {
  id: TokenId
  /** -1 = base, 0–51 = main track (absolute), 52–57 = home column, 57 = finish */
  position: number
  isHome: boolean
  isFinished: boolean
}

export interface BoardState {
  players: Record<PlayerId, TokenState[]>
  currentPlayerId: PlayerId | null
  lastDiceRoll: DiceValue | null
  turnNumber: number
  consecutiveSixes: number
  sixesRolled: number
  tokensCaptured: number
}

export interface GameConfig {
  mode: GameMode
  playerCount: 2 | 3 | 4
  players: import('./player').Player[]
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
  forfeit?: boolean
}

// ─── Board constants ──────────────────────────────────────────────────────────

export const PLAYER_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue']
export const TOKENS_PER_PLAYER = 4
export const MAIN_TRACK_LENGTH = 52
export const HOME_COL_START = 52
export const FINISH_POSITION = 57   // last home-column cell = finish

/**
 * Absolute main-track index where each colour's token enters when leaving base.
 * Track goes clockwise: Red(0) → Green(13) → Blue(26) → Yellow(39).
 */
export const PLAYER_ENTRY_SQUARES: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  blue: 26,
  yellow: 39,
}

/**
 * Safe squares on the main track (0–51).
 * Tokens on these squares cannot be captured.
 * Includes all four entry squares plus four additional starred squares.
 */
export const SAFE_SQUARES: number[] = [0, 8, 13, 21, 26, 34, 39, 47]

/**
 * 52 main-track cells as [row, col] on a 15×15 grid (0-indexed).
 * Traversal order is clockwise starting from Red's entry square.
 *
 * Grid layout:
 *   Red yard    : rows 0-5,  cols 0-5
 *   Green yard  : rows 0-5,  cols 9-14
 *   Blue yard   : rows 9-14, cols 9-14
 *   Yellow yard : rows 9-14, cols 0-5
 *   Center      : (7,7)
 */
export const TRACK_CELLS: [number, number][] = [
  // 0-4:  Row 6 left half → Red entry at 0
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  // 5-10: Col 6 upward
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  // 11-12: Top corner
  [0, 7], [0, 8],
  // 13-17: Col 8 downward → Green entry at 13
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  // 18-24: Row 6 right half
  [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  // 25-26: Right edge → Blue entry at 26
  [7, 14], [8, 14],
  // 27-31: Row 8 leftward (right section)
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  // 32-37: Col 8 downward (lower)
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  // 38-39: Bottom connector → Yellow entry at 39
  [14, 7], [14, 6],
  // 40-44: Col 6 upward (lower)
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  // 45-51: Row 8 leftward (left section)
  [8, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
]

/**
 * Home-column cells for each colour (positions 52–57 relative).
 * Index 0 = position 52 (first cell), index 5 = position 57 (finish).
 */
export const HOME_PATHS: Record<PlayerColor, [number, number][]> = {
  red:    [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  green:  [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  blue:   [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
  yellow: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
}

/** Center finishing cell */
export const CENTER_CELL: [number, number] = [7, 7]

/**
 * Token slot positions inside each home yard (4 slots per player).
 * Used only for visual rendering of tokens sitting in base.
 */
export const HOME_YARD_SLOTS: Record<PlayerColor, [number, number][]> = {
  red:    [[2, 2], [2, 4], [4, 2], [4, 4]],
  green:  [[2, 10], [2, 12], [4, 10], [4, 12]],
  blue:   [[10, 10], [10, 12], [12, 10], [12, 12]],
  yellow: [[10, 2], [10, 4], [12, 2], [12, 4]],
}
