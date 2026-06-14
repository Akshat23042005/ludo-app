import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getPlayerColorClass } from '@/core/game'
import { useGameStore } from '@/stores/gameStore'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { formatDuration } from '@/utils/format'
import { cn } from '@/utils/cn'

export function VictoryScreen() {
  const navigate = useNavigate()
  const snapshot = useGameStore((s) => s.snapshot)
  const resetGame = useGameStore((s) => s.resetGame)
  const abandonGame = useGameStore((s) => s.abandonGame)
  const recordMatch = useStatisticsStore((s) => s.recordMatch)
  const hasRecorded = useRef(false)

  const winner = snapshot.config?.players.find(
    (p) => p.id === snapshot.winnerId,
  )

  const durationMs =
    snapshot.startedAt && snapshot.finishedAt
      ? snapshot.finishedAt - snapshot.startedAt
      : 0

  useEffect(() => {
    if (snapshot.phase !== 'finished' || !winner || !snapshot.config) {
      navigate('/menu', { replace: true })
      return
    }

    if (hasRecorded.current) return
    hasRecorded.current = true

    recordMatch({
      playerCount: snapshot.config.playerCount,
      winnerName: winner.name,
      winnerColor: winner.color,
      durationMs,
      turns: snapshot.board.turnNumber,
      didWin: winner.isHuman,
      sixesRolled: snapshot.board.sixesRolled,
      tokensCaptured: snapshot.board.tokensCaptured,
    })
  }, [snapshot, winner, navigate, recordMatch, durationMs])

  if (!winner) return null

  const handlePlayAgain = () => {
    resetGame()
    navigate('/game')
  }

  const handleMenu = () => {
    abandonGame()
    navigate('/menu')
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-gold/15"
        >
          <Trophy className="size-10 text-gold" />
        </motion.div>

        <h1 className="font-display text-4xl text-off-white">Victory</h1>
        <p className="mt-2 text-slate-muted">A champion emerges</p>

        <Card variant="elevated" className="mt-8">
          <div className="flex items-center justify-center gap-3">
            <div
              className={cn(
                'size-4 rounded-full',
                getPlayerColorClass(winner.color),
              )}
            />
            <span className="text-xl font-semibold text-off-white">
              {winner.name}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-muted">
            Completed in {formatDuration(durationMs)} across{' '}
            {snapshot.board.turnNumber} turns
          </p>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={handlePlayAgain}>
            <RotateCcw className="size-4" />
            Play again
          </Button>
          <Button variant="secondary" size="lg" onClick={handleMenu}>
            <Home className="size-4" />
            Main menu
          </Button>
        </div>

        <Link
          to="/statistics"
          className="mt-6 inline-block text-sm text-gold hover:text-gold-light transition-colors"
        >
          View statistics
        </Link>
      </motion.div>
    </div>
  )
}
