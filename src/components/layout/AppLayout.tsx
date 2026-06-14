import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/ui/Navigation'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

interface AppLayoutProps {
  showNav?: boolean
  centered?: boolean
}

export function AppLayout({ showNav = true, centered = false }: AppLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgb(13 79 79 / 0.25), transparent),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgb(184 149 108 / 0.08), transparent)
          `,
        }}
      />

      {showNav && isMobile && <Navigation />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative z-10',
          showNav && isMobile && 'pt-14',
          centered && 'flex min-h-dvh flex-col items-center justify-center px-6',
          !centered && 'min-h-dvh',
        )}
      >
        {showNav && !isMobile && (
          <div className="mx-auto flex max-w-6xl justify-center px-6 pt-6">
            <Navigation />
          </div>
        )}
        <div
          className={cn(
            centered ? 'w-full max-w-lg' : 'mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6',
            showNav && !centered && 'pt-6',
          )}
        >
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
