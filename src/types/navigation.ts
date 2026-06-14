export type RouteId =
  | 'splash'
  | 'menu'
  | 'setup'
  | 'game'
  | 'settings'
  | 'how-to-play'
  | 'statistics'
  | 'victory'

export interface NavItem {
  id: RouteId
  label: string
  path: string
  icon: string
  showInNav?: boolean
}
