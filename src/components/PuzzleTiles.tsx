import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'

interface PuzzleTilesProps {
  children: ReactNode
  rows?: number
  cols?: number
  className?: string
}

// giats.me参考: 1枚のビジュアルを格子状のタイルに割り、各タイルを同じ内容の
// 拡大コピー＋逆オフセットで表示することでスライスする（画像の複製は不要）。
// それぞれのタイルにバラバラの周期・位相を与えて上下に揺らし、パズルのように
// 少しずつずれて見える演出にする。
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

export default function PuzzleTiles({ children, rows = 3, cols = 3, className = '' }: PuzzleTilesProps) {
  const tiles = useMemo(() => {
    const list: { row: number; col: number; duration: number; delay: number; amplitude: number }[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seed = row * cols + col
        list.push({
          row,
          col,
          duration: 3.5 + seededRandom(seed) * 3.5,
          delay: -seededRandom(seed + 50) * 6,
          amplitude: 6 + seededRandom(seed + 90) * 10,
        })
      }
    }
    return list
  }, [rows, cols])

  return (
    <div className={`relative ${className}`}>
      {tiles.map(({ row, col, duration, delay, amplitude }) => (
        <div
          key={`${row}-${col}`}
          className="animate-tile-float absolute overflow-hidden"
          style={
            {
              left: `${(col / cols) * 100}%`,
              top: `${(row / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              '--tile-amp': `${amplitude}px`,
            } as CSSProperties
          }
        >
          <div
            className="absolute"
            style={{
              left: `${-col * 100}%`,
              top: `${-row * 100}%`,
              width: `${cols * 100}%`,
              height: `${rows * 100}%`,
            }}
          >
            {children}
          </div>
        </div>
      ))}
    </div>
  )
}
