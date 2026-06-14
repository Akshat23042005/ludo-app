import type { DiceValue } from '@/types'

export function rollDice(): DiceValue {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue
}

export function canRollAgain(value: DiceValue, allowExtraTurnOnSix: boolean): boolean {
  return allowExtraTurnOnSix && value === 6
}
