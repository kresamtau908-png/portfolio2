import { useEffect, useRef, useState } from 'react'

// 参考: junni.co.jp のマウス追従演出。
// 画面全体を見えない正方形のマスで敷き詰め、マウスが入ったマスだけを一瞬表示して
// TTL後に消す。SVGフィルター（ぼかし→アルファを締める→縁だけ残す）をかけることで、
// 隣り合うマス同士が溶け合った、ぷにっとした輪郭線の軌跡に見える。
const CELL_TARGET_SIZE = 60 // px: マスのおおよその大きさ。画面幅を割り切れるよう列数から逆算する
const TTL = 200 // ms: マスが表示されてから消えるまで
const FILTER_ID = 'gooey-cursor-filter'

// PC幅かつマウス操作の環境だけで有効にする（タッチ端末では追従するカーソルが存在しない）
const ENABLE_QUERY = '(min-width: 812px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function getGrid() {
  const columns = Math.max(1, Math.floor(window.innerWidth / CELL_TARGET_SIZE))
  const cellSize = window.innerWidth / columns
  const rows = Math.ceil(window.innerHeight / cellSize)
  return { columns, rows, cellSize }
}

export default function GooeyCursor({ active = true }: { active?: boolean }) {
  const [enabled, setEnabled] = useState(() => window.matchMedia(ENABLE_QUERY).matches)
  const [grid, setGrid] = useState(getGrid)
  const cellsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mql = window.matchMedia(ENABLE_QUERY)
    const onChange = () => setEnabled(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const next = getGrid()
      setGrid((prev) => (prev.columns === next.columns && prev.rows === next.rows && prev.cellSize === next.cellSize ? prev : next))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // マスの表示/非表示はReactの再描画を通さず、DOMを直接切り替える（mousemoveの頻度が高いため）
  useEffect(() => {
    if (!enabled || !active) return
    const container = cellsRef.current
    if (!container) return
    const cells = container.children
    const timers = new Map<number, number>()
    let lastIndex = -1

    const onMove = (e: MouseEvent) => {
      const col = Math.floor(e.clientX / grid.cellSize)
      const row = Math.floor(e.clientY / grid.cellSize)
      if (col < 0 || col >= grid.columns || row < 0 || row >= grid.rows) return
      const index = row * grid.columns + col
      if (index === lastIndex) return
      lastIndex = index

      const cell = cells[index] as HTMLElement | undefined
      if (!cell) return
      cell.style.opacity = '1'
      window.clearTimeout(timers.get(index))
      timers.set(
        index,
        window.setTimeout(() => {
          cell.style.opacity = '0'
          timers.delete(index)
        }, TTL),
      )
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      timers.forEach((id) => window.clearTimeout(id))
      for (const cell of cells) (cell as HTMLElement).style.opacity = '0'
    }
  }, [enabled, active, grid])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-90">
      <svg className="absolute h-0 w-0">
        <filter id={FILTER_ID}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="gooey"
          />
          <feMorphology in="gooey" operator="dilate" radius="2" result="outline" />
          <feComposite in="outline" in2="gooey" operator="out" />
        </filter>
      </svg>
      <div
        ref={cellsRef}
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${grid.columns}, ${grid.cellSize}px)`,
          gridAutoRows: `${grid.cellSize}px`,
          filter: `url(#${FILTER_ID})`,
        }}
      >
        {Array.from({ length: grid.columns * grid.rows }, (_, i) => (
          <div key={i} className="bg-lime opacity-0" />
        ))}
      </div>
    </div>
  )
}
