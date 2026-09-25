import { useEffect, useState } from 'react'

interface LoaderProps {
  onDone: () => void
}

export default function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [showShort, setShowShort] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const duration = 2600
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      // ease-in cubic: 序盤はゆっくり、終盤で一気に追いつく（所要時間はdurationのまま変わらない）
      const eased = t * t * t
      const pct = Math.round(eased * 100)
      setProgress(pct)
      if (t >= 1) {
        setShowShort(true)
        setTimeout(() => setHidden(true), 350)
        setTimeout(onDone, 800)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div
      className={`ease-brand fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream text-ink transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <div className="overflow-hidden text-center">
          <h2
            className={`ease-brand text-h4 transition-transform duration-500 ${
              showShort ? '-translate-y-full' : 'translate-y-0'
            }`}
          >
            {showShort ? 'Building, Quietly.' : 'Quiet Strength'}
          </h2>
        </div>
        <div className="absolute bottom-8 right-8 text-h2 tabular-nums">{progress}%</div>
      </div>
    </div>
  )
}
