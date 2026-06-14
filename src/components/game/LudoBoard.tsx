import { motion } from 'framer-motion'
import { getPlayerColorHex } from '@/core/game'
import type { BoardState, PlayerColor, PlayerId, TokenId, TokenState } from '@/types'
import {
  CENTER_CELL,
  HOME_PATHS,
  HOME_YARD_SLOTS,
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

export function LudoBoard({
  boardState,
  validMoves,
  currentPlayerId,
  playerColors,
  onTokenClick,
}: LudoBoardProps) {
  // Render yard for a specific color
  const renderYard = (color: PlayerColor, xOffset: number, yOffset: number) => {
    const hex = getPlayerColorHex(color)
    return (
      <g transform={`translate(${xOffset}, ${yOffset})`}>
        <rect
          width={CELL_SIZE * 6}
          height={CELL_SIZE * 6}
          fill={`${hex}33`} // 20% opacity
          stroke={hex}
          strokeWidth="2"
          rx="12"
        />
        {/* White inner square */}
        <rect
          x={CELL_SIZE}
          y={CELL_SIZE}
          width={CELL_SIZE * 4}
          height={CELL_SIZE * 4}
          fill="#f5f3ef"
          rx="8"
        />
        {/* The 4 token slots */}
        {[
          [1.5, 1.5],
          [3.5, 1.5],
          [1.5, 3.5],
          [3.5, 3.5],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx * CELL_SIZE}
            cy={cy * CELL_SIZE}
            r={CELL_SIZE * 0.6}
            fill={`${hex}1a`} // 10% opacity
            stroke={hex}
            strokeWidth="2"
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

    if (token.isFinished) {
      // Finished tokens go to the center
      row = CENTER_CELL[0]
      col = CENTER_CELL[1]
    } else if (token.isHome) {
      // Use home yard slots
      const slot = HOME_YARD_SLOTS[color][token.id]
      row = slot[0]
      col = slot[1]
    } else if (token.position >= 52) {
      // Home column
      const idx = token.position - 52
      const slot = HOME_PATHS[color][idx]
      row = slot[0]
      col = slot[1]
    } else {
      // Main track
      const slot = TRACK_CELLS[token.position]
      row = slot[0]
      col = slot[1]
    }

    let x = col * CELL_SIZE + CELL_SIZE / 2
    let y = row * CELL_SIZE + CELL_SIZE / 2

    // Adjust for multiple tokens on the same square (unless in home yard)
    if (!token.isHome && totalOverlapping > 1) {
      const offset = 8
      if (totalOverlapping === 2) {
        x += overlapIndex === 0 ? -offset : offset
      } else if (totalOverlapping === 3) {
        if (overlapIndex === 0) {
          x -= offset; y -= offset
        } else if (overlapIndex === 1) {
          x += offset; y -= offset
        } else {
          y += offset
        }
      } else {
        if (overlapIndex === 0) {
          x -= offset; y -= offset
        } else if (overlapIndex === 1) {
          x += offset; y -= offset
        } else if (overlapIndex === 2) {
          x -= offset; y += offset
        } else {
          x += offset; y += offset
        }
      }
    }

    return { x, y }
  }

  // Pre-calculate overlapping tokens on the track
  const squareCounts: Record<number, number> = {}
  const homeColCounts: Record<string, number> = {} // color-idx

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
    <div className="relative mx-auto w-full max-w-2xl rounded-2xl bg-off-white shadow-elevated overflow-hidden border border-slate/20">
      <svg
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="w-full h-auto drop-shadow-md"
      >
        {/* Background cells for track */}
        {TRACK_CELLS.map(([row, col], i) => (
          <g key={`track-${i}`}>
            <rect
              x={col * CELL_SIZE}
              y={row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="#fff"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            {SAFE_SQUARES.includes(i) && (
              <polygon
                points={`${col * CELL_SIZE + CELL_SIZE / 2},${row * CELL_SIZE + 8} ${col * CELL_SIZE + CELL_SIZE - 8},${row * CELL_SIZE + CELL_SIZE - 8} ${col * CELL_SIZE + 8},${row * CELL_SIZE + CELL_SIZE - 8}`}
                fill="#cbd5e1"
                opacity="0.5"
              />
            )}
          </g>
        ))}

        {/* Home Columns */}
        {Object.entries(HOME_PATHS).map(([color, path]) =>
          path.map(([row, col], i) => (
            <rect
              key={`home-${color}-${i}`}
              x={col * CELL_SIZE}
              y={row * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={`${getPlayerColorHex(color as PlayerColor)}33`}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          )),
        )}

        {/* Entry Squares */}
        <rect
          x={TRACK_CELLS[0][1] * CELL_SIZE}
          y={TRACK_CELLS[0][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={`${getPlayerColorHex('red')}33`}
        />
        <rect
          x={TRACK_CELLS[13][1] * CELL_SIZE}
          y={TRACK_CELLS[13][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={`${getPlayerColorHex('green')}33`}
        />
        <rect
          x={TRACK_CELLS[26][1] * CELL_SIZE}
          y={TRACK_CELLS[26][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={`${getPlayerColorHex('blue')}33`}
        />
        <rect
          x={TRACK_CELLS[39][1] * CELL_SIZE}
          y={TRACK_CELLS[39][0] * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={`${getPlayerColorHex('yellow')}33`}
        />

        {/* Center Finish */}
        <polygon
          points={`${6 * CELL_SIZE},${6 * CELL_SIZE} ${9 * CELL_SIZE},${6 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
          fill={`${getPlayerColorHex('red')}aa`}
        />
        <polygon
          points={`${9 * CELL_SIZE},${6 * CELL_SIZE} ${9 * CELL_SIZE},${9 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
          fill={`${getPlayerColorHex('green')}aa`}
        />
        <polygon
          points={`${9 * CELL_SIZE},${9 * CELL_SIZE} ${6 * CELL_SIZE},${9 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
          fill={`${getPlayerColorHex('blue')}aa`}
        />
        <polygon
          points={`${6 * CELL_SIZE},${9 * CELL_SIZE} ${6 * CELL_SIZE},${6 * CELL_SIZE} ${7.5 * CELL_SIZE},${7.5 * CELL_SIZE}`}
          fill={`${getPlayerColorHex('yellow')}aa`}
        />

        {/* The 4 Yards */}
        {renderYard('red', 0, 0)}
        {renderYard('green', 9 * CELL_SIZE, 0)}
        {renderYard('blue', 9 * CELL_SIZE, 9 * CELL_SIZE)}
        {renderYard('yellow', 0, 9 * CELL_SIZE)}

        {/* Tokens */}
        {Object.entries(boardState.players).map(([pId, tokens]) => {
          const color = playerColors[pId]
          const isPlayerTurn = pId === currentPlayerId

          return tokens.map((token) => {
            const isValidMove = isPlayerTurn && validMoves.includes(token.id)

            // Calculate overlap index
            let overlapIndex = 0
            let totalOverlapping = 1

            if (!token.isHome && !token.isFinished) {
              if (token.position < 52) {
                totalOverlapping = squareCounts[token.position]
                // Very naive overlap index assignment
                const sameSquareTokens = Object.values(boardState.players)
                  .flat()
                  .filter((t) => t.position === token.position && !t.isHome && !t.isFinished)
                overlapIndex = sameSquareTokens.findIndex(
                  (t) => t.id === token.id && playerColors[pId] === color, // simplification
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
                  stiffness: 200,
                  damping: 20,
                  mass: 0.8,
                }}
                className={cn(
                  'transition-opacity',
                  isValidMove ? 'cursor-pointer' : 'cursor-default',
                  token.isFinished ? 'opacity-0' : 'opacity-100', // Hide if finished (optional)
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
                  stroke="#fff"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                />
                {isValidMove && (
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={16}
                    fill="none"
                    stroke={getPlayerColorHex(color)}
                    strokeWidth="2"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
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
