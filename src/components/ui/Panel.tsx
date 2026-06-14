import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: ReactNode
  accent?: boolean
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, title, subtitle, action, accent = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-charcoal-light/60 backdrop-blur-md',
          accent ? 'border-gold/25' : 'border-slate/20',
          className,
        )}
        {...props}
      >
        {(title || action) && (
          <div className="flex items-center justify-between gap-4 border-b border-slate/15 px-5 py-4">
            <div>
              {title && (
                <h3 className="text-sm font-semibold tracking-wide text-off-white uppercase">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-slate-muted">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    )
  },
)

Panel.displayName = 'Panel'
