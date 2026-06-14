import { motion } from 'framer-motion'
import { Volume2, VolumeX, Vibrate, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Panel } from '@/components/ui/Panel'
import { useSettingsStore } from '@/stores/settingsStore'
import type { SoundLevel, ThemeMode } from '@/types'
import { cn } from '@/utils/cn'

const soundLevels: { value: SoundLevel; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const themeModes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
]

export function SettingsScreen() {
  const settings = useSettingsStore((s) => s.settings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const resetSettings = useSettingsStore((s) => s.resetSettings)

  return (
    <div className="py-6 sm:py-10">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl text-off-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-muted">
          Tailor audio, display, and gameplay preferences
        </p>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Audio">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-muted uppercase tracking-wider">
                Sound effects
              </label>
              <div className="flex flex-wrap gap-2">
                {soundLevels.map(({ value, label }) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={settings.soundLevel === value ? 'primary' : 'secondary'}
                    onClick={() => updateSettings({ soundLevel: value })}
                  >
                    {value === 'off' ? (
                      <VolumeX className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm text-off-white">Background music</span>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={(e) =>
                  updateSettings({ musicEnabled: e.target.checked })
                }
                className="accent-teal"
              />
            </label>
          </div>
        </Panel>

        <Panel title="Display">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-muted uppercase tracking-wider">
                Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {themeModes.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={settings.themeMode === value ? 'primary' : 'secondary'}
                    onClick={() => updateSettings({ themeMode: value })}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm text-off-white">Reduce motion</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) =>
                  updateSettings({ reducedMotion: e.target.checked })
                }
                className="accent-teal"
              />
            </label>
          </div>
        </Panel>

        <Panel title="Gameplay">
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-off-white">
                <Vibrate className="size-4 text-slate-muted" />
                Haptic feedback
              </span>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={(e) =>
                  updateSettings({ hapticsEnabled: e.target.checked })
                }
                className="accent-teal"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-off-white">Show tutorial hints</span>
              <input
                type="checkbox"
                checked={settings.showTutorialHints}
                onChange={(e) =>
                  updateSettings({ showTutorialHints: e.target.checked })
                }
                className="accent-teal"
              />
            </label>
            <div>
              <label
                htmlFor="player-name"
                className="mb-2 block text-xs text-slate-muted uppercase tracking-wider"
              >
                Display name
              </label>
              <input
                id="player-name"
                type="text"
                value={settings.playerName}
                onChange={(e) =>
                  updateSettings({ playerName: e.target.value })
                }
                className={cn(
                  'w-full rounded-lg border border-slate/30 bg-charcoal px-4 py-2.5',
                  'text-sm text-off-white outline-none focus:border-teal/50',
                )}
              />
            </div>
          </div>
        </Panel>

        <Card variant="outline">
          <p className="text-sm text-slate-muted">
            Settings persist locally and will sync with your account when online
            play launches.
          </p>
          <Button
            variant="danger"
            size="sm"
            className="mt-4"
            onClick={resetSettings}
          >
            Reset to defaults
          </Button>
        </Card>
      </div>
    </div>
  )
}
