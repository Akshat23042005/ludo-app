import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'

export function SplashScreen() {
  const navigate = useNavigate()
  const completeSplash = useUIStore((s) => s.completeSplash)

  useEffect(() => {
    const timer = setTimeout(() => {
      completeSplash()
      navigate('/menu', { replace: true })
    }, 2400)

    return () => clearTimeout(timer)
  }, [completeSplash, navigate])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ rotate: -8 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="size-24 rounded-2xl border border-gold/30 bg-charcoal-light shadow-glow">
            <svg viewBox="0 0 96 96" className="size-full p-4" aria-hidden>
              <rect x="8" y="8" width="36" height="36" rx="4" fill="#0d4f4f" />
              <rect x="52" y="8" width="36" height="36" rx="4" fill="#5c9a6e" />
              <rect x="8" y="52" width="36" height="36" rx="4" fill="#c9a84c" />
              <rect x="52" y="52" width="36" height="36" rx="4" fill="#5c7ec4" />
              <circle cx="48" cy="48" r="10" fill="#b8956c" />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-display text-5xl tracking-tight text-off-white sm:text-6xl"
        >
          Ludo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-3 text-sm tracking-widest text-gold uppercase"
        >
          Roll. Race. Reign.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-10 h-px w-32 origin-left bg-gradient-to-r from-teal via-gold to-transparent"
        />
      </motion.div>
    </div>
  )
}
