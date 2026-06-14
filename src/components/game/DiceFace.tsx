import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface DiceFaceProps {
  value: number | null
  isRolling: boolean
}

export function DiceFace({ value, isRolling }: DiceFaceProps) {
  const dots = value ? Array.from({ length: value }, (_, i) => i) : []

  return (
    <motion.div
      initial={false}
      animate={
        isRolling
          ? {
              rotate: [0, -10, 15, -15, 10, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 0.4,
                repeat: Infinity,
                ease: 'linear',
              },
            }
          : { rotate: 0, scale: 1 }
      }
      className={cn(
        'relative flex size-16 items-center justify-center rounded-xl',
        'border-2 border-gold/40 bg-charcoal shadow-elevated transition-colors',
        value === 6 && !isRolling && 'border-gold bg-gold/10',
        (!value || isRolling) && 'opacity-70',
      )}
    >
      {isRolling ? (
        <span className="text-2xl font-bold text-gold animate-pulse">?</span>
      ) : value ? (
        <div className="grid size-full grid-cols-3 grid-rows-3 gap-1 p-2">
          {dots.map((i) => {
            // Position mapping based on standard 6-sided dice layout
            let classes = ''
            if (value === 1) {
              if (i === 0) classes = 'col-start-2 row-start-2'
            } else if (value === 2) {
              if (i === 0) classes = 'col-start-1 row-start-3'
              if (i === 1) classes = 'col-start-3 row-start-1'
            } else if (value === 3) {
              if (i === 0) classes = 'col-start-1 row-start-3'
              if (i === 1) classes = 'col-start-2 row-start-2'
              if (i === 2) classes = 'col-start-3 row-start-1'
            } else if (value === 4) {
              if (i === 0) classes = 'col-start-1 row-start-1'
              if (i === 1) classes = 'col-start-3 row-start-1'
              if (i === 2) classes = 'col-start-1 row-start-3'
              if (i === 3) classes = 'col-start-3 row-start-3'
            } else if (value === 5) {
              if (i === 0) classes = 'col-start-1 row-start-1'
              if (i === 1) classes = 'col-start-3 row-start-1'
              if (i === 2) classes = 'col-start-2 row-start-2'
              if (i === 3) classes = 'col-start-1 row-start-3'
              if (i === 4) classes = 'col-start-3 row-start-3'
            } else if (value === 6) {
              if (i === 0) classes = 'col-start-1 row-start-1'
              if (i === 1) classes = 'col-start-1 row-start-2'
              if (i === 2) classes = 'col-start-1 row-start-3'
              if (i === 3) classes = 'col-start-3 row-start-1'
              if (i === 4) classes = 'col-start-3 row-start-2'
              if (i === 5) classes = 'col-start-3 row-start-3'
            }

            return (
              <div
                key={i}
                className={cn('m-auto size-2.5 rounded-full bg-gold', classes)}
              />
            )
          })}
        </div>
      ) : (
        <span className="text-xl font-bold text-slate-muted">-</span>
      )}
    </motion.div>
  )
}
