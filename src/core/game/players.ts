import type { Player, PlayerColor, PlayerConfig } from '@/types'
import { PLAYER_COLORS, PLAYER_ENTRY_SQUARES } from '@/types/game'
import { generateId } from '@/utils/helpers'

const DEFAULT_NAMES: Record<PlayerColor, string> = {
  red: 'Crimson',
  green: 'Emerald',
  yellow: 'Amber',
  blue: 'Sapphire',
}

export function createPlayer(config: PlayerConfig): Player {
  return {
    id: generateId(),
    name: config.name.trim() || DEFAULT_NAMES[config.color],
    color: config.color,
    isHuman: config.isHuman,
    isActive: true,
    tokensFinished: 0,
  }
}

export function getDefaultPlayerConfigs(count: 2 | 3 | 4): PlayerConfig[] {
  return PLAYER_COLORS.slice(0, count).map((color, index) => ({
    name: index === 0 ? 'You' : DEFAULT_NAMES[color],
    color,
    isHuman: index === 0,
  }))
}

export function createPlayersFromConfigs(configs: PlayerConfig[]): Player[] {
  return configs.map((config) => createPlayer(config))
}

export function getPlayerColorClass(color: PlayerColor): string {
  const map: Record<PlayerColor, string> = {
    red: 'bg-player-red',
    green: 'bg-player-green',
    yellow: 'bg-player-yellow',
    blue: 'bg-player-blue',
  }
  return map[color]
}

export function getPlayerColorHex(color: PlayerColor): string {
  const map: Record<PlayerColor, string> = {
    red: '#c45c5c',
    green: '#5c9a6e',
    yellow: '#c9a84c',
    blue: '#5c7ec4',
  }
  return map[color]
}

export function getNextPlayerIndex(
  currentIndex: number,
  playerCount: number,
): number {
  return (currentIndex + 1) % playerCount
}

export function getPlayerEntrySquare(color: PlayerColor): number {
  return PLAYER_ENTRY_SQUARES[color]
}
