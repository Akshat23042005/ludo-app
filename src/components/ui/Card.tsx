import { forwardRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  animate?: boolean
}

const variantStyles = {
  default: 'bg-charcoal-light/80 border border-slate/20',
  elevated: 'bg-charcoal-light shadow-elevated border border-slate/10',
  outline: 'bg-transparent border border-slate/30',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      animate = false,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      'rounded-xl backdrop-blur-sm',
      variantStyles[variant],
      paddingStyles[padding],
      className,
    )

    if (animate) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={classes}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
