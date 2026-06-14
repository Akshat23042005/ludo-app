import { Outlet } from 'react-router-dom'
import { PauseOverlay } from '@/screens/PauseOverlay'

export function GameLayout() {
  return (
    <div className="relative min-h-dvh bg-charcoal">
      <Outlet />
      <PauseOverlay />
    </div>
  )
}
