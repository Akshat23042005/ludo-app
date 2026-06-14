import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Panel } from '@/components/ui/Panel'
import { getPlayerColorClass } from '@/core/game'
import { useGameStore } from '@/stores/gameStore'
import type { PlayerColor } from '@/types'
import { cn } from '@/utils/cn'

const playerCounts = [2, 3, 4] as const

export function GameSetupScreen() {
  const navigate = useNavigate()
  const setupDraft = useGameStore((s) => s.setupDraft)
  const setPlayerCount = useGameStore((s) => s.setPlayerCount)
  const updatePlayerConfig = useGameStore((s) => s.updatePlayerConfig)
  const setSetupOption = useGameStore((s) => s.setSetupOption)
  const startGame = useGameStore((s) => s.startGame)

  const handleStart = () => {
    startGame()
    navigate('/game')
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/menu')}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div>
          <h1 className="font-display text-3xl text-off-white">Game Setup</h1>
          <p className="text-sm text-slate-muted">
            Configure your local match
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Panel title="Players" subtitle={`${setupDraft.playerCount} participants`}>
            <div className="mb-6 flex gap-2">
              {playerCounts.map((count) => (
                <Button
                  key={count}
                  variant={setupDraft.playerCount === count ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setPlayerCount(count)}
                >
                  <Users className="size-4" />
                  {count}
                </Button>
              ))}
            </div>

            <ul className="space-y-3">
              {setupDraft.playerConfigs.map((config, index) => (
                <li key={config.color}>
                  <Card padding="sm" variant="outline">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'size-3 rounded-full',
                          getPlayerColorClass(config.color as PlayerColor),
                        )}
                      />
                      <input
                        type="text"
                        value={config.name}
                        onChange={(e) =>
                          updatePlayerConfig(index, { name: e.target.value })
                        }
                        className="flex-1 bg-transparent text-sm text-off-white outline-none placeholder:text-slate-muted"
                        placeholder="Player name"
                        aria-label={`Name for ${config.color} player`}
                      />
                      <label className="flex items-center gap-2 text-xs text-slate-muted">
                        <input
                          type="checkbox"
                          checked={config.isHuman}
                          onChange={(e) =>
                            updatePlayerConfig(index, {
                              isHuman: e.target.checked,
                            })
                          }
                          className="accent-teal"
                        />
                        Human
                      </label>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <Panel title="Rules" subtitle="House preferences">
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm text-off-white">Extra turn on six</span>
                <input
                  type="checkbox"
                  checked={setupDraft.allowExtraTurnOnSix}
                  onChange={(e) =>
                    setSetupOption('allowExtraTurnOnSix', e.target.checked)
                  }
                  className="accent-teal"
                />
              </label>
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm text-off-white">Exact finish required</span>
                <input
                  type="checkbox"
                  checked={setupDraft.requireExactFinish}
                  onChange={(e) =>
                    setSetupOption('requireExactFinish', e.target.checked)
                  }
                  className="accent-teal"
                />
              </label>
            </div>
          </Panel>

          <Card variant="elevated">
            <p className="text-sm text-slate-muted">
              Online multiplayer will connect to this same setup flow. Player
              slots and rule options are designed to sync with a future lobby
              service.
            </p>
            <Button fullWidth size="lg" className="mt-6" onClick={handleStart}>
              <Play className="size-5" />
              Start Game
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
