import { useInView } from '../hooks/useInView'
import RevealText from './RevealText'

const STEPS = [
  {
    no: '01',
    en: 'THINK',
    ja: '考える',
    text: '目的とユーザーを見つめ直し何を作るべきかを丁寧に言語化する',
    shape: 'circle' as const,
  },
  {
    no: '02',
    en: 'BUILD',
    ja: 'つくる',
    text: '小さく確実に積み上げながら意味のあるコードとデザインに落とし込む',
    shape: 'square' as const,
  },
  {
    no: '03',
    en: 'IMPROVE',
    ja: '磨く',
    text: '一度で終わらせず見直しと改善を重ねて精度を高めていく',
    shape: 'triangle' as const,
  },
]

function Shape({ type }: { type: 'circle' | 'square' | 'triangle' }) {
  const common = { fill: 'none', stroke: 'var(--color-lime)', strokeWidth: 2.5 }
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7 nav:h-[1.8vw] nav:w-[1.8vw]">
      {type === 'circle' && <circle cx="24" cy="24" r="19" {...common} />}
      {type === 'square' && <rect x="6" y="6" width="36" height="36" rx="4" {...common} />}
      {type === 'triangle' && <polygon points="24,5 44,41 4,41" strokeLinejoin="round" {...common} />}
    </svg>
  )
}

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35)

  return (
    <div
      ref={ref}
      className="ease-brand flex flex-col gap-4 border-t border-ink/10 pt-8 transition-[opacity,transform] duration-700 nav:gap-[1vw] nav:pt-[2vw]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="ease-brand transition-[transform,opacity] duration-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'scale(1)' : 'scale(0.5)',
            transitionDelay: `${index * 120 + 150}ms`,
          }}
        >
          <Shape type={step.shape} />
        </div>
        <span className="text-p-x text-ink/40">{step.no}</span>
      </div>
      <h3 className="text-h3 font-semibold">
        {step.en} <span className="text-ink/40">/ {step.ja}</span>
      </h3>
      <p className="text-p-l max-w-sm text-ink/60">{step.text}</p>
    </div>
  )
}

export default function Philosophy() {
  return (
    <section id="philosophy" className="layout-grid bg-cream py-28 nav:py-[12vw]">
      <div className="col-span-6 mb-16 nav:col-span-16 nav:mb-[5vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-ink/40">04</span>
          <span className="text-p-x tracking-[0.2em] text-ink/50">PHILOSOPHY</span>
        </div>
        <h2 className="text-h2 mt-4 nav:mt-[1vw]">
          <RevealText text="大切にしていること" />
        </h2>
      </div>

      <div className="col-span-6 grid grid-cols-1 gap-12 nav:col-span-16 nav:grid-cols-3 nav:gap-[3vw]">
        {STEPS.map((step, i) => (
          <Step key={step.no} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}
