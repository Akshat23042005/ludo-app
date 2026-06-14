import { useNavigate } from 'react-router-dom'
import { Play, Home, RotateCcw } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

export function PauseOverlay() {
  const navigate = useNavigate()
  const isPauseOpen = useUIStore((s) => s.isPauseOpen)
  const closePause = useUIStore((s) => s.closePause)
  const resume = useGameStore((s) => s.resume)
  const resetGame = useGameStore((s) => s.resetGame)
  const abandonGame = useGameStore((s) => s.abandonGame)

  const handleResume = () => {
    resume()
    closePause()
  }

  const handleQuit = () => {
    abandonGame()
    closePause()
    navigate('/menu')
  }

  const handleRestart = () => {
    resetGame()
    closePause()
  }

  return (
    <Modal
      isOpen={isPauseOpen}
      onClose={handleResume}
      title="Game Paused"
      description="Take a moment. Your match is saved locally."
      size="sm"
    >
      <div className="flex flex-col gap-3">
        <Button onClick={handleResume}>
          <Play className="size-4" />
          Resume
        </Button>
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="size-4" />
          Restart
        </Button>
        <Button variant="danger" onClick={handleQuit}>
          <Home className="size-4" />
          Quit to menu
        </Button>
      </div>
    </Modal>
  )
}
