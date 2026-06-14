import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, BookOpen, Gamepad2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useStatisticsStore } from '@/stores/statisticsStore'
import { formatWinRate } from '@/utils/format'

const menuActions = [
  {
    path: '/setup',
    label: 'New Game',
    description: 'Configure players and start a match',
    icon: Gamepad2,
    primary: true,
  },
  {
    path: '/statistics',
    label: 'Statistics',
    description: 'View your performance history',
    icon: BarChart3,
    primary: false,
  },
  {
    path: '/how-to-play',
    label: 'How to Play',
    description: 'Learn the rules and strategies',
    icon: BookOpen,
    primary: false,
  },
  {
    path: '/settings',
    label: 'Settings',
    description: 'Audio, display, and preferences',
    icon: Settings,
    primary: false,
  },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function MainMenuScreen() {
  const statistics = useStatisticsStore((s) => s.statistics)
  const { gamesPlayed, gamesWon } = statistics.lifetime

  return (
    <div className="py-8 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center sm:mb-14"
      >
        <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
          Welcome back
        </p>
        <h1 className="mt-2 font-display text-4xl text-off-white sm:text-5xl">
          Ludo
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-slate-muted">
          A refined board experience built for local play today and online
          matches tomorrow.
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2"
      >
        {menuActions.map(({ path, label, description, icon: Icon, primary }) => (
          <motion.div key={path} variants={itemVariants}>
            <Link to={path} className="block h-full">
              <Card
                variant={primary ? 'elevated' : 'default'}
                className="group h-full transition-colors hover:border-teal/30"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={
                      primary
                        ? 'rounded-lg bg-teal/20 p-3 text-gold'
                        : 'rounded-lg bg-charcoal p-3 text-slate-muted group-hover:text-gold'
                    }
                  >
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-semibold text-off-white">{label}</h2>
                    <p className="mt-1 text-sm text-slate-muted">{description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {gamesPlayed > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card variant="outline" padding="sm" className="text-center">
            <p className="text-xs tracking-wider text-slate-muted uppercase">
              Lifetime record
            </p>
            <p className="mt-1 text-lg font-medium text-off-white">
              {gamesWon} wins / {gamesPlayed} games
              <span className="ml-2 text-gold">
                ({formatWinRate(gamesWon, gamesPlayed)})
              </span>
            </p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex justify-center"
      >
        <Link to="/setup" className="inline-block">
          <Button size="lg">
            <Gamepad2 className="size-5" />
            Play Now
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
