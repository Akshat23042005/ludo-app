import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function RouteErrorFallback() {
  const error = useRouteError()

  let title = 'Page not found'
  let message = 'The page you are looking for does not exist.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message ?? message
  } else if (error instanceof Error) {
    title = 'Navigation error'
    message = error.message
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <Card variant="elevated" className="max-w-md text-center">
        <h1 className="font-display text-3xl text-off-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-muted">{message}</p>
        <Link to="/menu" className="mt-6 inline-block">
          <Button variant="primary">
            <Home className="size-4" />
            Back to menu
          </Button>
        </Link>
      </Card>
    </div>
  )
}
