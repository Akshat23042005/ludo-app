import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  Gamepad2,
  Home,
  Menu,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/stores/uiStore'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { Button } from './Button'

const navItems = [
  { path: '/menu', label: 'Home', icon: Home },
  { path: '/setup', label: 'Play', icon: Gamepad2 },
  { path: '/statistics', label: 'Stats', icon: BarChart3 },
  { path: '/how-to-play', label: 'Rules', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const isMobile = useIsMobile()
  const isNavOpen = useUIStore((s) => s.isNavOpen)
  const toggleNav = useUIStore((s) => s.toggleNav)
  const closeNav = useUIStore((s) => s.closeNav)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-teal/20 text-gold'
        : 'text-slate-muted hover:bg-white/5 hover:text-off-white',
    )

  if (isMobile) {
    return (
      <>
        <header
          className={cn(
            'fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between',
            'border-b border-slate/15 bg-charcoal/90 px-4 backdrop-blur-md',
            className,
          )}
        >
          <span className="font-display text-lg text-off-white tracking-tight">
            Ludo
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNav}
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isNavOpen}
          >
            {isNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </header>

        <AnimatePresence>
          {isNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-charcoal/70 backdrop-blur-sm"
                onClick={closeNav}
                aria-hidden
              />
              <motion.nav
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="fixed top-14 right-0 bottom-0 z-50 w-72 border-l border-slate/20 bg-charcoal-light p-4"
                aria-label="Main navigation"
              >
                <ul className="space-y-1">
                  {navItems.map(({ path, label, icon: Icon }) => (
                    <li key={path}>
                      <NavLink to={path} className={linkClass} onClick={closeNav}>
                        <Icon className="size-4" aria-hidden />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <nav
      className={cn(
        'flex items-center gap-1 rounded-xl border border-slate/20',
        'bg-charcoal-light/60 p-1.5 backdrop-blur-md',
        className,
      )}
      aria-label="Main navigation"
    >
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path} className={linkClass}>
          <Icon className="size-4" aria-hidden />
          <span className="hidden lg:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
