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
import { TOKENS_PER_PLAYER } from '@/types/game'
import { canRollAgain, rollDice } from './dice'
import { getNextPlayerIndex } from './players'

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

export function rollForCurrentPlayer(snapshot: GameSnapshot): GameSnapshot {
  if (snapshot.phase !== 'playing' || !snapshot.config) return snapshot

  const value = rollDice()
  const extraTurn = canRollAgain(
    value,
    snapshot.config.allowExtraTurnOnSix,
  )

  return {
    ...snapshot,
    board: {
      ...snapshot.board,
      lastDiceRoll: value,
      turnNumber: snapshot.board.turnNumber + (extraTurn ? 0 : 1),
    },
  }
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

  if (token.isFinished) {
    return {
      snapshot,
      result: { success: false, message: 'Token has already finished.' },
    }
  }

  let updatedToken: TokenState

  if (token.isHome) {
    if (!canEnterBoard(dice)) {
      return {
        snapshot,
        result: {
          success: false,
          message: 'You need a six to leave home.',
        },
      }
    }
    updatedToken = { ...token, isHome: false, position: 0 }
  } else {
    updatedToken = { ...token, position: token.position + dice }
  }

  const finishThreshold = 57
  if (updatedToken.position >= finishThreshold) {
    updatedToken = { ...updatedToken, isFinished: true, position: finishThreshold }
  }

  const updatedTokens = tokens.map((t) =>
    t.id === tokenId ? updatedToken : t,
  )

  const updatedPlayers = {
    ...snapshot.board.players,
    [playerId]: updatedTokens,
  }

  const finishedCount = updatedTokens.filter((t) => t.isFinished).length
  const updatedConfigPlayers = snapshot.config.players.map((p) =>
    p.id === playerId ? { ...p, tokensFinished: finishedCount } : p,
  )

  const allFinished = finishedCount === TOKENS_PER_PLAYER
  const extraTurn =
    canRollAgain(dice, snapshot.config.allowExtraTurnOnSix) || allFinished

  let nextSnapshot: GameSnapshot = {
    ...snapshot,
    config: { ...snapshot.config, players: updatedConfigPlayers },
    board: {
      ...snapshot.board,
      players: updatedPlayers,
      lastDiceRoll: extraTurn && !allFinished ? dice : null,
    },
    winnerId: allFinished ? playerId : snapshot.winnerId,
    phase: allFinished ? 'finished' : snapshot.phase,
    finishedAt: allFinished ? Date.now() : snapshot.finishedAt,
  }

  if (!extraTurn || allFinished) {
    nextSnapshot = advanceTurn(nextSnapshot)
  }

  return {
    snapshot: nextSnapshot,
    result: {
      success: true,
      message: allFinished ? 'All tokens home!' : 'Token moved.',
      extraTurn: extraTurn && !allFinished,
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
