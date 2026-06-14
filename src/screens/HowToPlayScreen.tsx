import { motion } from 'framer-motion'
import { Target, Shield, Zap, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Panel } from '@/components/ui/Panel'

const rules = [
  {
    icon: Target,
    title: 'Objective',
    content:
      'Move all four tokens from your home base around the board and into your finish area before opponents.',
  },
  {
    icon: Zap,
    title: 'Rolling a Six',
    content:
      'A six lets a token leave home. With house rules enabled, rolling a six grants an extra turn.',
  },
  {
    icon: Shield,
    title: 'Safe squares',
    content:
      'Colored safe zones protect tokens from capture. Plan routes to cross safely under pressure.',
  },
  {
    icon: Trophy,
    title: 'Winning',
    content:
      'The first player to bring all four tokens home wins. Exact finish rules can be toggled in setup.',
  },
]

const steps = [
  'Choose player count and names in Game Setup.',
  'Take turns rolling the dice when it is your move.',
  'Tap a token to move after rolling. You need a six to exit home.',
  'Capture opponents by landing on their tokens outside safe zones.',
  'Race all four tokens to the center to claim victory.',
]

export function HowToPlayScreen() {
  return (
    <div className="py-6 sm:py-10">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl text-off-white">How to Play</h1>
        <p className="mt-1 text-sm text-slate-muted">
          Master the fundamentals of classic Ludo
        </p>
      </motion.header>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {rules.map(({ icon: Icon, title, content }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="h-full">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-teal/15 text-gold">
                <Icon className="size-5" />
              </div>
              <h2 className="font-semibold text-off-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-muted">
                {content}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Panel title="Quick start" subtitle="Five steps to your first match">
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-4 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                {index + 1}
              </span>
              <span className="text-slate-muted leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}
