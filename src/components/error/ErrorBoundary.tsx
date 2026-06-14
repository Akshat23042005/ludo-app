import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-dvh items-center justify-center p-6">
          <Card variant="elevated" className="max-w-md text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-player-red/15">
              <AlertTriangle className="size-6 text-player-red" />
            </div>
            <h1 className="font-display text-2xl text-off-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-muted">
              An unexpected error occurred. You can try again or return to the
              main menu.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-24 overflow-auto rounded-lg bg-charcoal p-3 text-left text-xs text-slate-muted">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset}>
                <RefreshCw className="size-4" />
                Try again
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/menu')}
              >
                Main menu
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
