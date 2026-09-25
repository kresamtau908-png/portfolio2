import { useEffect, useRef, useState } from 'react'
import HeroBlocks from './HeroBlocks'
import RevealText from './RevealText'

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0

    const update = () => {
      const el = wrapperRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
        setProgress(p)
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="home" ref={wrapperRef} className="relative h-[220vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-20 nav:pb-0">
        <div className="layout-grid items-center">
          <div className="col-span-6 nav:col-span-8 nav:col-start-1">
            <p className="text-p-x mb-6 tracking-[0.2em] text-lime nav:mb-[1.4vw]">FRONT-END DEVELOPER</p>
            <h1 className="text-h1">
              <RevealText text="Quiet Strength" className="block" />
            </h1>
            <p className="text-h4 mt-6 font-normal text-ink/70 nav:mt-[1.4vw]">
              <RevealText text="静かに積み重ねる" delay={0.15} />
            </p>
          </div>

          <div className="col-span-6 mt-14 hidden nav:col-span-7 nav:col-start-10 nav:mt-0 nav:block">
            <HeroBlocks progress={progress} rows={3} cols={3} className="aspect-square w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
