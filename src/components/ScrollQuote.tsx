import { useEffect, useMemo, useRef, useState } from 'react'

interface ScrollQuoteProps {
  text: string
  caption?: string
}

// Deterministic pseudo-random offset per character, so the layout always
// starts from the same scatter instead of re-randomizing on render.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

export default function ScrollQuote({ text, caption }: ScrollQuoteProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  // 日本語はスペースで区切られていないため、文字単位で分割する
  const words = Array.from(text)
  const [progress, setProgress] = useState(0)

  // each character drifts in from close to the viewer (large + blurry),
  // shrinking and sharpening into place as it settles
  const offsets = useMemo(
    () =>
      words.map((_, i) => {
        const angle = seededRandom(i) * Math.PI * 2
        const drift = 10 + seededRandom(i + 40) * 30
        return {
          x: Math.cos(angle) * drift,
          y: Math.sin(angle) * drift,
          scale: 1.35 + seededRandom(i + 60) * 0.45,
          rotate: (seededRandom(i + 120) - 0.5) * 6,
        }
      }),
    [words],
  )

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

  // each character gets its own slice of the overall scroll progress, with
  // overlapping bands so neighbouring characters converge in a smooth wave
  const band = Math.min(0.16, 1.8 / words.length)

  // 英単語の途中で改行されないよう、スペース区切りの単語ごとにグループ化する。
  // 文字単位のアニメーションはそのままに、単語内は nowrap のコンテナで包んで改行points を単語間だけに限定する
  const wordGroups = useMemo(() => {
    const groups: number[][] = []
    let current: number[] = []
    words.forEach((char, i) => {
      if (char === ' ') {
        if (current.length) {
          groups.push(current)
          current = []
        }
        groups.push([i])
      } else {
        current.push(i)
      }
    })
    if (current.length) groups.push(current)
    return groups
  }, [words])

  const renderChar = (i: number) => {
    const char = words[i]
    const start = (i / words.length) * (1 - band)
    const local = Math.min(1, Math.max(0, (progress - start) / band))
    const eased = 1 - Math.pow(1 - local, 3)
    const offset = offsets[i]
    const inv = 1 - eased
    const scale = 1 + inv * (offset.scale - 1)

    return (
      <span
        key={i}
        className="inline-block will-change-transform"
        style={{
          opacity: eased,
          filter: `blur(${inv * 6}px)`,
          transform: `translate(${inv * offset.x}px, ${inv * offset.y}px) scale(${scale}) rotate(${inv * offset.rotate}deg)`,
        }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    )
  }

  return (
    <section ref={wrapperRef} className="relative h-[180vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-5 overflow-hidden px-8 nav:px-[6vw]">
        <p className="text-h3 max-w-3xl text-center font-semibold">
          {wordGroups.map((indices, gi) =>
            indices.length > 1 ? (
              <span key={gi} className="inline-block whitespace-nowrap">
                {indices.map((i) => renderChar(i))}
              </span>
            ) : (
              renderChar(indices[0])
            ),
          )}
        </p>

        {caption && (
          <p
            className="text-p-l max-w-xl text-center text-ink/50"
            style={{ opacity: Math.min(1, progress * 1.2) }}
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  )
}
