import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dices, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import { getCurrentPlayer, getPlayerColorClass } from '@/core/game'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import type { PlayerColor, TokenId } from '@/types'
import { cn } from '@/utils/cn'

function BoardPreview() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div className="absolute inset-0 rounded-2xl border border-slate/25 bg-charcoal-light shadow-elevated">
        <div className="grid h-full grid-cols-3 grid-rows-3 gap-0 p-3">
          <CornerQuadrant color="red" position="top-left" />
          <TrackStrip orientation="horizontal" />
          <CornerQuadrant color="green" position="top-right" />
          <TrackStrip orientation="vertical" />
          <CenterHub />
          <TrackStrip orientation="vertical" />
          <CornerQuadrant color="yellow" position="bottom-left" />
          <TrackStrip orientation="horizontal" />
          <CornerQuadrant color="blue" position="bottom-right" />
        </div>
      </div>
    </div>
  )
}

function CornerQuadrant({
  color,
}: {
  color: PlayerColor
  position: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg p-2',
        color === 'red' && 'bg-player-red/15',
        color === 'green' && 'bg-player-green/15',
        color === 'yellow' && 'bg-player-yellow/15',
        color === 'blue' && 'bg-player-blue/15',
      )}
    >
      <div className="grid h-full grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'aspect-square rounded-full border-2 border-charcoal/50',
              getPlayerColorClass(color),
            )}
          />
        ))}
      </div>
    </div>
  )
}

function TrackStrip({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const cells = Array.from({ length: 6 })
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-0.5',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
      )}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className="size-3 rounded-sm bg-cream/10 border border-slate/20"
        />
      ))}
    </div>
  )
}

function CenterHub() {
  return (
    <div className="flex items-center justify-center">
      <div className="grid size-full grid-cols-2 grid-rows-2 overflow-hidden rounded-lg">
        <div className="bg-player-red/30" />
        <div className="bg-player-green/30" />
        <div className="bg-player-yellow/30" />
        <div className="bg-player-blue/30" />
      </div>
    </div>
  )
}

export function GameBoardScreen() {
  const navigate = useNavigate()
  const snapshot = useGameStore((s) => s.snapshot)
  const isRolling = useGameStore((s) => s.isRolling)
  const rollDice = useGameStore((s) => s.rollDice)
  const moveToken = useGameStore((s) => s.moveToken)
  const resetGame = useGameStore((s) => s.resetGame)
  const openPause = useUIStore((s) => s.openPause)
  const pause = useGameStore((s) => s.pause)

  const handlePause = () => {
    pause()
    openPause()
  }

  const currentPlayer = getCurrentPlayer(snapshot)
  const dice = snapshot.board.lastDiceRoll

  useEffect(() => {
    if (snapshot.phase === 'idle') {
      navigate('/setup', { replace: true })
    }
    if (snapshot.phase === 'finished' && snapshot.winnerId) {
      navigate('/victory', { replace: true })
    }
  }, [snapshot.phase, snapshot.winnerId, navigate])

  if (!snapshot.config || !currentPlayer) return null

  const tokens = snapshot.board.players[currentPlayer.id] ?? []

  return (
    <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'size-3 rounded-full',
              getPlayerColorClass(currentPlayer.color),
            )}
          />
          <div>
            <p className="text-xs text-slate-muted uppercase tracking-wider">
              Current turn
            </p>
            <p className="font-medium text-off-white">{currentPlayer.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePause}>
            <Pause className="size-4" />
            Pause
          </Button>
        </div>
      </header>

      <BoardPreview />

      <div className="mx-auto mt-8 w-full max-w-lg space-y-4">
        <Panel title="Dice" accent>
          <div className="flex items-center justify-between">
            <motion.div
              key={dice ?? 'empty'}
              initial={isRolling ? { rotate: 0 } : false}
              animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="flex size-16 items-center justify-center rounded-xl border border-gold/30 bg-charcoal text-3xl font-bold text-gold"
            >
              {isRolling ? '...' : (dice ?? '-')}
            </motion.div>
            <Button
              onClick={rollDice}
              isLoading={isRolling}
              disabled={!!dice && !isRolling}
            >
              <Dices className="size-4" />
              Roll
            </Button>
          </div>
        </Panel>

        <Panel title="Your tokens">
          <div className="flex gap-3">
            {tokens.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() =>
                  moveToken(currentPlayer.id, token.id as TokenId)
                }
                disabled={!dice || token.isFinished}
                className={cn(
                  'flex size-12 items-center justify-center rounded-full border-2 transition-all',
                  getPlayerColorClass(currentPlayer.color),
                  token.isFinished && 'opacity-30',
                  token.isHome && 'opacity-60',
                  dice && !token.isFinished && 'hover:scale-105 cursor-pointer',
                  (!dice || token.isFinished) && 'cursor-not-allowed',
                )}
                aria-label={`Move token ${token.id + 1}`}
              >
                <span className="text-xs font-bold text-charcoal">
                  {token.id + 1}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-muted">
            Turn {snapshot.board.turnNumber + 1}
          </p>
        </Panel>
      </div>
    </div>
  )
}
