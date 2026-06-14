import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Panel'
import { getCurrentPlayer, getPlayerColorClass } from '@/core/game'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { LudoBoard, DiceFace, PlayerInfo } from '@/components/game'
import { cn } from '@/utils/cn'

export function GameBoardScreen() {
  const navigate = useNavigate()
  const snapshot = useGameStore((s) => s.snapshot)
  const isRolling = useGameStore((s) => s.isRolling)
  const validMoves = useGameStore((s) => s.validMoves)
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

  // Extract color mapping for board
  const playerColors = snapshot.config.players.reduce((acc, p) => {
    acc[p.id] = p.color
    return acc
  }, {} as Record<string, any>)

  const turnSkipped = dice && !isRolling && validMoves.length === 0

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

      <div className="mb-6">
        <PlayerInfo players={snapshot.config.players} currentPlayerId={currentPlayer.id} />
      </div>

      <LudoBoard
        boardState={snapshot.board}
        validMoves={validMoves}
        currentPlayerId={currentPlayer.id}
        playerColors={playerColors}
        onTokenClick={(playerId, tokenId) => moveToken(playerId, tokenId)}
      />

      <div className="mx-auto mt-8 w-full max-w-lg space-y-4">
        <Panel title="Action" accent>
          <div className="flex items-center justify-between">
            <DiceFace value={dice} isRolling={isRolling} />
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={rollDice}
                isLoading={isRolling}
                disabled={!!dice && !isRolling && validMoves.length > 0}
                className="w-32"
              >
                Roll Dice
              </Button>
              {turnSkipped && (
                <p className="text-xs text-player-red animate-pulse">No valid moves</p>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
