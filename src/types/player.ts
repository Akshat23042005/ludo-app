export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue'

export type PlayerId = string

export interface Player {
  id: PlayerId
  name: string
  color: PlayerColor
  isHuman: boolean
  isActive: boolean
  tokensFinished: number
}

export interface PlayerConfig {
  name: string
  color: PlayerColor
  isHuman: boolean
}
