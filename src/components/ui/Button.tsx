import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-teal text-off-white hover:bg-teal-light shadow-glow border border-teal-muted/30',
  secondary:
    'bg-charcoal-light text-off-white hover:bg-slate/40 border border-slate/30',
  ghost: 'bg-transparent text-off-white hover:bg-white/5',
  outline:
    'bg-transparent text-gold border border-gold/40 hover:bg-gold/10 hover:border-gold/60',
  danger:
    'bg-player-red/20 text-player-red border border-player-red/30 hover:bg-player-red/30',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-200 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-charcoal disabled:opacity-50 disabled:pointer-events-none',
          'active:scale-[0.98] hover:enabled:scale-[1.01]',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
