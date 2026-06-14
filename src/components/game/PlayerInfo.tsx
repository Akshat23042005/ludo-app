import { Trophy } from 'lucide-react'
import { getPlayerColorClass } from '@/core/game'
import type { Player, PlayerId } from '@/types'
import { cn } from '@/utils/cn'
import { TOKENS_PER_PLAYER } from '@/types/game'

interface PlayerInfoProps {
  players: Player[]
  currentPlayerId: PlayerId | null
}

export function PlayerInfo({ players, currentPlayerId }: PlayerInfoProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {players.map((player) => {
        const isCurrent = player.id === currentPlayerId
        const isWinner = player.tokensFinished === TOKENS_PER_PLAYER

        return (
          <div
            key={player.id}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
              isCurrent
                ? 'border-gold/30 bg-gold/5 shadow-glow'
                : 'border-slate/15 bg-charcoal-light/40',
              isWinner && 'border-teal/30 bg-teal/10',
            )}
          >
            <div
              className={cn(
                'size-3 shrink-0 rounded-full',
                getPlayerColorClass(player.color),
                isCurrent && 'ring-2 ring-gold/40 ring-offset-2 ring-offset-charcoal',
              )}
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-off-white' : 'text-slate-muted',
                )}
              >
                {player.name}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-muted">
                  {player.tokensFinished}/{TOKENS_PER_PLAYER}
                </span>
                {isWinner && <Trophy className="size-3 text-teal" />}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
