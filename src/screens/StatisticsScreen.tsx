import { motion } from 'framer-motion'
import { Dices, Swords, Trophy, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Panel } from '@/components/ui/Panel'
import { Button } from '@/components/ui/Button'
import { getPlayerColorClass } from '@/core/game'
import { useStatisticsStore } from '@/stores/statisticsStore'
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatWinRate,
} from '@/utils/format'
import { cn } from '@/utils/cn'

export function StatisticsScreen() {
  const statistics = useStatisticsStore((s) => s.statistics)
  const resetStatistics = useStatisticsStore((s) => s.resetStatistics)
  const { lifetime, recentMatches } = statistics

  const statCards = [
    {
      icon: Trophy,
      label: 'Games won',
      value: formatNumber(lifetime.gamesWon),
    },
    {
      icon: TrendingUp,
      label: 'Win rate',
      value: formatWinRate(lifetime.gamesWon, lifetime.gamesPlayed),
    },
    {
      icon: Dices,
      label: 'Sixes rolled',
      value: formatNumber(lifetime.sixesRolled),
    },
    {
      icon: Swords,
      label: 'Tokens captured',
      value: formatNumber(lifetime.tokensCaptured),
    },
  ]

  return (
    <div className="py-6 sm:py-10">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl text-off-white">Statistics</h1>
        <p className="mt-1 text-sm text-slate-muted">
          {lifetime.gamesPlayed === 0
            ? 'Play your first match to start tracking progress'
            : `${formatNumber(lifetime.gamesPlayed)} games played`}
        </p>
      </motion.header>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card padding="sm">
              <Icon className="mb-2 size-4 text-gold" />
              <p className="text-xs text-slate-muted uppercase tracking-wider">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-off-white">
                {value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Panel
        title="Recent matches"
        subtitle={
          recentMatches.length === 0
            ? 'No matches yet'
            : `Last ${recentMatches.length} results`
        }
      >
        {recentMatches.length === 0 ? (
          <p className="text-sm text-slate-muted">
            Complete a game to see your match history here.
          </p>
        ) : (
          <ul className="space-y-3">
            {recentMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate/15 bg-charcoal/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'size-2.5 rounded-full',
                      getPlayerColorClass(match.winnerColor),
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-off-white">
                      {match.winnerName} won
                    </p>
                    <p className="text-xs text-slate-muted">
                      {formatDate(match.playedAt)} · {match.playerCount} players
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-muted">
                  <p>{formatDuration(match.durationMs)}</p>
                  <p>{match.turns} turns</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {lifetime.gamesPlayed > 0 && (
        <Button
          variant="danger"
          size="sm"
          className="mt-6"
          onClick={resetStatistics}
        >
          Clear statistics
        </Button>
      )}
    </div>
  )
}
