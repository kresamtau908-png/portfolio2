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
    const duration = 1400
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      if (pct >= 100) {
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
            {showShort ? '静かに、積み重ねる。' : 'Quiet Strength'}
          </h2>
        </div>
        <div className="absolute bottom-8 right-8 text-h2 tabular-nums">{progress}%</div>
      </div>
    </div>
  )
}
