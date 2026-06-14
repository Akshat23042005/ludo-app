import type {
  BoardState,
  DiceValue,
  GameConfig,
  GameSnapshot,
  MoveResult,
  Player,
  PlayerId,
  TokenId,
  TokenState,
} from '@/types'
import {
  FINISH_POSITION,
  HOME_COL_START,
  MAIN_TRACK_LENGTH,
  SAFE_SQUARES,
  TOKENS_PER_PLAYER,
} from '@/types/game'
import { canRollAgain, rollDice } from './dice'
import { getNextPlayerIndex, getPlayerEntrySquare } from './players'

function createInitialTokens(): TokenState[] {
  return Array.from({ length: TOKENS_PER_PLAYER }, (_, id) => ({
    id: id as TokenId,
    position: -1,
    isHome: true,
    isFinished: false,
  }))
}

export function createInitialBoard(players: Player[]): BoardState {
  const playerTokens = players.reduce<Record<PlayerId, TokenState[]>>(
    (acc, player) => {
      acc[player.id] = createInitialTokens()
      return acc
    },
    {},
  )

  return {
    players: playerTokens,
    currentPlayerId: players[0]?.id ?? null,
    lastDiceRoll: null,
    turnNumber: 0,
    consecutiveSixes: 0,
    sixesRolled: 0,
    tokensCaptured: 0,
  }
}

export function createGameSnapshot(config: GameConfig): GameSnapshot {
  return {
    phase: 'playing',
    config,
    board: createInitialBoard(config.players),
    winnerId: null,
    startedAt: Date.now(),
    pausedAt: null,
    finishedAt: null,
  }
}

export function getCurrentPlayer(
  snapshot: GameSnapshot,
): Player | undefined {
  if (!snapshot.config || !snapshot.board.currentPlayerId) return undefined
  return snapshot.config.players.find(
    (p) => p.id === snapshot.board.currentPlayerId,
  )
}

export function getValidMoves(
  snapshot: GameSnapshot,
  playerId: PlayerId,
  dice: DiceValue | null,
): TokenId[] {
  if (!dice || snapshot.phase !== 'playing' || !snapshot.config) return []

  const tokens = snapshot.board.players[playerId] || []
  const player = snapshot.config.players.find((p) => p.id === playerId)
  if (!player) return []

  const validMoves: TokenId[] = []
  for (const token of tokens) {
    if (token.isFinished) continue
    if (token.isHome) {
      if (canEnterBoard(dice)) {
        validMoves.push(token.id)
      }
      continue
    }

    const newPos = computeNewPosition(player, token, dice, snapshot.config.requireExactFinish)
    if (newPos !== null) {
      validMoves.push(token.id)
    }
  }

  return validMoves
}

export function computeNewPosition(
  player: Player,
  token: TokenState,
  dice: DiceValue,
  requireExactFinish: boolean,
): number | null {
  if (token.isHome || token.isFinished) return null

  const entrySquare = getPlayerEntrySquare(player.color)
  let stepsTaken = 0

  if (token.position >= HOME_COL_START) {
    stepsTaken = MAIN_TRACK_LENGTH + (token.position - HOME_COL_START)
  } else {
    stepsTaken = (token.position - entrySquare + MAIN_TRACK_LENGTH) % MAIN_TRACK_LENGTH
  }

  const targetSteps = stepsTaken + dice

  // Too far
  if (targetSteps > MAIN_TRACK_LENGTH + 5) {
    return requireExactFinish ? null : FINISH_POSITION
  }

  // Exact finish
  if (targetSteps === MAIN_TRACK_LENGTH + 5) {
    return FINISH_POSITION
  }

  // Still on main track
  if (targetSteps < MAIN_TRACK_LENGTH) {
    return (token.position + dice) % MAIN_TRACK_LENGTH
  }

  // Enters home column
  const homeColOffset = targetSteps - MAIN_TRACK_LENGTH
  return HOME_COL_START + homeColOffset
}

export function rollForCurrentPlayer(snapshot: GameSnapshot): GameSnapshot {
  if (snapshot.phase !== 'playing' || !snapshot.config) return snapshot

  const value = rollDice()
  
  let newConsecutiveSixes = snapshot.board.consecutiveSixes
  if (value === 6) {
    newConsecutiveSixes++
  } else {
    newConsecutiveSixes = 0
  }

  const board: BoardState = {
    ...snapshot.board,
    lastDiceRoll: value,
    consecutiveSixes: newConsecutiveSixes,
  }
  
  let resultSnapshot = { ...snapshot, board }
  
  // Track sixes
  if (value === 6) {
    resultSnapshot.board.sixesRolled++
  }

  if (newConsecutiveSixes === 3) {
    // Forfeit turn
    resultSnapshot.board.lastDiceRoll = null
    resultSnapshot.board.consecutiveSixes = 0
    return advanceTurn(resultSnapshot)
  }

  return resultSnapshot
}

export function advanceTurn(snapshot: GameSnapshot): GameSnapshot {
  if (!snapshot.config || snapshot.config.players.length === 0) {
    return snapshot
  }

  const players = snapshot.config.players
  const currentIndex = players.findIndex(
    (p) => p.id === snapshot.board.currentPlayerId,
  )
  const nextIndex = getNextPlayerIndex(
    currentIndex === -1 ? 0 : currentIndex,
    players.length,
  )

  return {
    ...snapshot,
    board: {
      ...snapshot.board,
      currentPlayerId: players[nextIndex].id,
      lastDiceRoll: null,
      consecutiveSixes: 0,
      turnNumber: snapshot.board.turnNumber + 1,
    },
  }
}

export function canEnterBoard(dice: DiceValue): boolean {
  return dice === 6
}

export function moveToken(
  snapshot: GameSnapshot,
  playerId: PlayerId,
  tokenId: TokenId,
): { snapshot: GameSnapshot; result: MoveResult } {
  if (snapshot.phase !== 'playing' || !snapshot.config) {
    return {
      snapshot,
      result: { success: false, message: 'Game is not in play.' },
    }
  }

  if (snapshot.board.currentPlayerId !== playerId) {
    return {
      snapshot,
      result: { success: false, message: 'Not your turn.' },
    }
  }

  const dice = snapshot.board.lastDiceRoll
  if (!dice) {
    return {
      snapshot,
      result: { success: false, message: 'Roll the dice first.' },
    }
  }

  const tokens = snapshot.board.players[playerId]
  const token = tokens?.find((t) => t.id === tokenId)
  if (!token) {
    return {
      snapshot,
      result: { success: false, message: 'Token not found.' },
    }
  }

  const player = snapshot.config.players.find(p => p.id === playerId)
  if (!player) {
    return { snapshot, result: { success: false, message: 'Player not found.' } }
  }

  const validMoves = getValidMoves(snapshot, playerId, dice)
  if (!validMoves.includes(tokenId)) {
    return {
      snapshot,
      result: { success: false, message: 'Invalid move.' },
    }
  }

  let newPosition: number
  if (token.isHome) {
    newPosition = getPlayerEntrySquare(player.color)
  } else {
    newPosition = computeNewPosition(player, token, dice, snapshot.config.requireExactFinish)!
  }

  const isFinished = newPosition === FINISH_POSITION

  // Handle Capture
  let captured = false
  let updatedPlayers = { ...snapshot.board.players }
  let tokensCapturedInThisMove = 0

  if (!isFinished && newPosition < HOME_COL_START && !SAFE_SQUARES.includes(newPosition)) {
    // Check all opponents for a token at newPosition
    for (const [otherPlayerId, otherTokens] of Object.entries(updatedPlayers)) {
      if (otherPlayerId === playerId) continue

      const capturedTokenIndex = otherTokens.findIndex(t => t.position === newPosition && !t.isHome && !t.isFinished)
      if (capturedTokenIndex !== -1) {
        captured = true
        tokensCapturedInThisMove++
        const updatedOtherTokens = [...otherTokens]
        updatedOtherTokens[capturedTokenIndex] = {
          ...updatedOtherTokens[capturedTokenIndex],
          position: -1,
          isHome: true,
        }
        updatedPlayers[otherPlayerId] = updatedOtherTokens
      }
    }
  }

  // Update moving token
  const updatedTokens = tokens.map((t) =>
    t.id === tokenId
      ? { ...t, position: newPosition, isHome: false, isFinished }
      : t,
  )
  updatedPlayers[playerId] = updatedTokens

  const finishedCount = updatedTokens.filter((t) => t.isFinished).length
  const updatedConfigPlayers = snapshot.config.players.map((p) =>
    p.id === playerId ? { ...p, tokensFinished: finishedCount } : p,
  )

  const allFinished = finishedCount === TOKENS_PER_PLAYER
  const extraTurn =
    captured || canRollAgain(dice, snapshot.config.allowExtraTurnOnSix)

  let nextSnapshot: GameSnapshot = {
    ...snapshot,
    config: { ...snapshot.config, players: updatedConfigPlayers },
    board: {
      ...snapshot.board,
      players: updatedPlayers,
      lastDiceRoll: extraTurn && !allFinished ? dice : null,
      tokensCaptured: snapshot.board.tokensCaptured + tokensCapturedInThisMove,
    },
    winnerId: allFinished ? playerId : snapshot.winnerId,
    phase: allFinished ? 'finished' : snapshot.phase,
    finishedAt: allFinished ? Date.now() : snapshot.finishedAt,
  }

  if (allFinished) {
    // Game over
  } else if (!extraTurn) {
    nextSnapshot = advanceTurn(nextSnapshot)
  } else {
     // If it's an extra turn, clear the dice so player can roll again
    nextSnapshot.board.lastDiceRoll = null
  }

  return {
    snapshot: nextSnapshot,
    result: {
      success: true,
      message: allFinished ? 'All tokens home!' : 'Token moved.',
      extraTurn: extraTurn && !allFinished,
      captured,
    },
  }
}

export function pauseGame(snapshot: GameSnapshot): GameSnapshot {
  if (snapshot.phase !== 'playing') return snapshot
  return { ...snapshot, phase: 'paused', pausedAt: Date.now() }
}

export function resumeGame(snapshot: GameSnapshot): GameSnapshot {
  if (snapshot.phase !== 'paused') return snapshot
  return { ...snapshot, phase: 'playing', pausedAt: null }
}
