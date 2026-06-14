import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { GameLayout } from '@/components/layout/GameLayout'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { RouteErrorFallback } from '@/components/error/RouteErrorFallback'
import { SplashScreen } from '@/screens/SplashScreen'
import { MainMenuScreen } from '@/screens/MainMenuScreen'
import { GameSetupScreen } from '@/screens/GameSetupScreen'
import { GameBoardScreen } from '@/screens/GameBoardScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { HowToPlayScreen } from '@/screens/HowToPlayScreen'
import { StatisticsScreen } from '@/screens/StatisticsScreen'
import { VictoryScreen } from '@/screens/VictoryScreen'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <AppLayout showNav={false} centered />,
        children: [{ index: true, element: <SplashScreen /> }],
      },
      {
        element: <AppLayout />,
        children: [
          { path: 'menu', element: <MainMenuScreen /> },
          { path: 'setup', element: <GameSetupScreen /> },
          { path: 'settings', element: <SettingsScreen /> },
          { path: 'how-to-play', element: <HowToPlayScreen /> },
          { path: 'statistics', element: <StatisticsScreen /> },
        ],
      },
      {
        element: <GameLayout />,
        children: [
          { path: 'game', element: <GameBoardScreen /> },
          { path: 'victory', element: <VictoryScreen /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/menu" replace />,
  },
])
