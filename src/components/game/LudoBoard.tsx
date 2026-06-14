import { motion } from 'framer-motion'
import { getPlayerColorHex } from '@/core/game'
import type { BoardState, PlayerColor, PlayerId, TokenId, TokenState } from '@/types'
import {
  CENTER_CELL,
  HOME_PATHS,
  SAFE_SQUARES,
  TRACK_CELLS,
} from '@/types/game'
import { cn } from '@/utils/cn'

interface LudoBoardProps {
  boardState: BoardState
  validMoves: TokenId[]
  currentPlayerId: PlayerId | null
  playerColors: Record<PlayerId, PlayerColor>
  onTokenClick: (playerId: PlayerId, tokenId: TokenId) => void
}

const CELL_SIZE = 40
const BOARD_SIZE = CELL_SIZE * 15

// Precise coordinates for the 4 slots in a 6x6 yard
const YARD_SLOT_OFFSETS = [
  [2, 2],
  [4, 2],
  [2, 4],
  [4, 4],
]

export function LudoBoard({
  boardState,
  validMoves,
  currentPlayerId,
  playerColors,
  onTokenClick,
}: LudoBoardProps) {
  
  // Renders the 6x6 yard
  const renderYard = (color: PlayerColor, startCol: number, startRow: number) => {
    const hex = getPlayerColorHex(color)
    const xOffset = startCol * CELL_SIZE
    const yOffset = startRow * CELL_SIZE
    
    return (
      <g transform={`translate(${xOffset}, ${yOffset})`}>
        {/* Outer colored box */}
        <rect
          width={CELL_SIZE * 6}
          height={CELL_SIZE * 6}
          fill={hex}
          stroke="#1a1f24"
          strokeWidth="1"
        />
        {/* Inner white box */}
        <rect
          x={CELL_SIZE}
          y={CELL_SIZE}
          width={CELL_SIZE * 4}
          height={CELL_SIZE * 4}
          fill="#ffffff"
          stroke="#1a1f24"
          strokeWidth="1"
        />
        {/* The 4 token placeholder circles */}
        {YARD_SLOT_OFFSETS.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx * CELL_SIZE}
            cy={cy * CELL_SIZE}
            r={CELL_SIZE * 0.5}
            fill="#ffffff"
            stroke={hex}
            strokeWidth="3"
          />
        ))}
      </g>
    )
  }

  // Calculate pixel coordinates for a token
  const getTokenCoords = (
    color: PlayerColor,
    token: TokenState,
    overlapIndex: number,
    totalOverlapping: number,
  ) => {
    let row: number, col: number
    let isHome = false

    if (token.isFinished) {
      row = CENTER_CELL[0]
      col = CENTER_CELL[1]
    } else if (token.isHome) {
      isHome = true
      // Position based on color's yard corner
      const [offsetX, offsetY] = YARD_SLOT_OFFSETS[token.id]
      
      if (color === 'red') { col = offsetX; row = offsetY }
      else if (color === 'green') { col = 9 + offsetX; row = offsetY }
      else if (color === 'blue') { col = 9 + offsetX; row = 9 + offsetY }
      else /* yellow */ { col = offsetX; row = 9 + offsetY }
      
    } else if (token.position >= 52) {
      const idx = token.position - 52
      const slot = HOME_PATHS[color][idx]
      row = slot[0]
      col = slot[1]
    } else {
      const slot = TRACK_CELLS[token.position]
      row = slot[0]
      col = slot[1]
    }

    let x = col * CELL_SIZE + (isHome ? 0 : CELL_SIZE / 2)
    let y = row * CELL_SIZE + (isHome ? 0 : CELL_SIZE / 2)

    // Overlap adjustments (only on track)
    if (!token.isHome && !token.isFinished && totalOverlapping > 1) {
      const offset = 8
      if (totalOverlapping === 2) {
        x += overlapIndex === 0 ? -offset : offset
      } else if (totalOverlapping === 3) {
        if (overlapIndex === 0) { x -= offset; y -= offset }
        else if (overlapIndex === 1) { x += offset; y -= offset }
        else { y += offset }
      } else {
        if (overlapIndex === 0) { x -= offset; y -= offset }
        else if (overlapIndex === 1) { x += offset; y -= offset }
        else if (overlapIndex === 2) { x -= offset; y += offset }
        else { x += offset; y += offset }
      }
    }

    return { x, y }
  }

  // Pre-calculate overlapping tokens
  const squareCounts: Record<number, number> = {}
  const homeColCounts: Record<string, number> = {} 

  Object.entries(boardState.players).forEach(([pId, tokens]) => {
    const color = playerColors[pId]
    tokens.forEach((t) => {
      if (t.isHome || t.isFinished) return
      if (t.position < 52) {
        squareCounts[t.position] = (squareCounts[t.position] || 0) + 1
      } else {
        const key = `${color}-${t.position - 52}`
        homeColCounts[key] = (homeColCounts[key] || 0) + 1
      }
    })
  })

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-md bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border-2 border-slate/30">
      <svg
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="w-full h-auto"
      >
        {/* Draw 15x15 grid background for tracks */}
        <g stroke="#cbd5e1" strokeWidth="1">
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * CELL_SIZE} x2={BOARD_SIZE} y2={i * CELL_SIZE} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * CELL_SIZE} y1="0" x2={i * CELL_SIZE} y2={BOARD_SIZE} />
          ))}
        </g>

        {/* Clear non-track corners to white before drawing yards */}
        <rect x="0" y="0" width={CELL_SIZE*6} height={CELL_SIZE*6} fill="#ffffff" />
        <rect x={CELL_SIZE*9} y="0" width={CELL_SIZE*6} height={CELL_SIZE*6} fill="#ffffff" />
        <rect x="0" y={CELL_SIZE*9} width={CELL_SIZE*6} height={CELL_SIZE*6} fill="#ffffff" />
        <rect x={CELL_SIZE*9} y={CELL_SIZE*9} width={CELL_SIZE*6} height={CELL_SIZE*6} fill="#ffffff" />

        {/* Home Columns */}
        {Object.entries(HOME_PATHS).map(([color, path]) =>
          path.map(([row, col]) => (
            <rect
              key={`home-${color}-${row}-${col}`}
              x={col * CELL_SIZE}
              y={row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={getPlayerColorHex(color as PlayerColor)}
            />
          )),
        )}

        {/* Entry Squares (Colored) */}
        <rect
          x={TRACK_CELLS[0][1] * CELL_SIZE}
          y={TRACK_CELLS[0][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={getPlayerColorHex('red')}
        />
        <rect
          x={TRACK_CELLS[13][1] * CELL_SIZE}
          y={TRACK_CELLS[13][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={getPlayerColorHex('green')}
        />
        <rect
          x={TRACK_CELLS[26][1] * CELL_SIZE}
          y={TRACK_CELLS[26][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={getPlayerColorHex('blue')}
        />
        <rect
          x={TRACK_CELLS[39][1] * CELL_SIZE}
          y={TRACK_CELLS[39][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={getPlayerColorHex('yellow')}
        />

        {/* Safe Star Squares */}
        {SAFE_SQUARES.map((posIndex) => {
          // Skip drawing star on entry squares as they are already fully colored
          if ([0, 13, 26, 39].includes(posIndex)) return null
          
          const [row, col] = TRACK_CELLS[posIndex]
          const cx = col * CELL_SIZE + CELL_SIZE / 2
          const cy = row * CELL_SIZE + CELL_SIZE / 2
          // SVG Star polygon
          return (
            <polygon
              key={`star-${posIndex}`}
              points={`${cx},${cy-10} ${cx+3},${cy-3} ${cx+10},${cy-3} ${cx+4},${cy+2} ${cx+6},${cy+9} ${cx},${cy+5} ${cx-6},${cy+9} ${cx-4},${cy+2} ${cx-10},${cy-3} ${cx-3},${cy-3}`}
              fill="#94a3b8"
            />
          )
        })}

        {/* Center Finish Area */}
        <g stroke="#1a1f24" strokeWidth="1">
          <polygon
            points={`${6 * CELL_SIZE},${6 * CELL_SIZE} ${9 * CELL_SIZE},${6 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
            fill={getPlayerColorHex('red')}
          />
          <polygon
            points={`${9 * CELL_SIZE},${6 * CELL_SIZE} ${9 * CELL_SIZE},${9 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
            fill={getPlayerColorHex('green')}
          />
          <polygon
            points={`${9 * CELL_SIZE},${9 * CELL_SIZE} ${6 * CELL_SIZE},${9 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
            fill={getPlayerColorHex('blue')}
          />
          <polygon
            points={`${6 * CELL_SIZE},${9 * CELL_SIZE} ${6 * CELL_SIZE},${6 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
            fill={getPlayerColorHex('yellow')}
          />
        </g>

        {/* The 4 Yards */}
        {renderYard('red', 0, 0)}
        {renderYard('green', 9, 0)}
        {renderYard('blue', 9, 9)}
        {renderYard('yellow', 0, 9)}

        {/* Tokens */}
        {Object.entries(boardState.players).map(([pId, tokens]) => {
          const color = playerColors[pId]
          const isPlayerTurn = pId === currentPlayerId

          return tokens.map((token) => {
            const isValidMove = isPlayerTurn && validMoves.includes(token.id)

            // Overlap assignment
            let overlapIndex = 0
            let totalOverlapping = 1

            if (!token.isHome && !token.isFinished) {
              if (token.position < 52) {
                totalOverlapping = squareCounts[token.position]
                const sameSquareTokens = Object.values(boardState.players)
                  .flat()
                  .filter((t) => t.position === token.position && !t.isHome && !t.isFinished)
                overlapIndex = sameSquareTokens.findIndex(
                  (t) => t.id === token.id,
                )
              } else {
                const key = `${color}-${token.position - 52}`
                totalOverlapping = homeColCounts[key]
                const sameSquareTokens = tokens.filter((t) => t.position === token.position)
                overlapIndex = sameSquareTokens.findIndex((t) => t.id === token.id)
              }
            }

            const { x, y } = getTokenCoords(color, token, Math.max(0, overlapIndex), totalOverlapping)

            return (
              <motion.g
                key={`${pId}-${token.id}`}
                initial={false}
                animate={{ x, y }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 25,
                  mass: 0.8,
                }}
                className={cn(
                  'transition-opacity',
                  isValidMove ? 'cursor-pointer' : 'cursor-default',
                  token.isFinished ? 'opacity-0' : 'opacity-100',
                )}
                onClick={() => {
                  if (isValidMove) {
                    onTokenClick(pId, token.id)
                  }
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={12}
                  fill={getPlayerColorHex(color)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  }}
                />
                {/* Inner detail for token */}
                <circle
                  cx={0}
                  cy={0}
                  r={6}
                  fill="#ffffff"
                  opacity={0.3}
                />
                {isValidMove && (
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={18}
                    fill="none"
                    stroke={getPlayerColorHex(color)}
                    strokeWidth="3"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            )
          })
        })}
      </svg>
    </div>
  )
}
