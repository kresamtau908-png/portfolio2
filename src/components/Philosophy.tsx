import { useInView } from '../hooks/useInView'
import RevealText from './RevealText'

const STEPS = [
  {
    no: '01',
    en: 'THINK',
    ja: '考える',
    text: '目的とユーザーを見つめ直し、何を作るべきかを丁寧に言語化する。',
  },
  {
    no: '02',
    en: 'BUILD',
    ja: 'つくる',
    text: '小さく確実に積み上げながら、意味のあるコードとデザインに落とし込む。',
  },
  {
    no: '03',
    en: 'IMPROVE',
    ja: '磨く',
    text: '一度で終わらせず、見直し・改善を重ねて静かに精度を高めていく。',
  },
]

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
      <span className="text-p-x text-ink/40">{step.no}</span>
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
          <RevealText text="静かに、丁寧に。" />
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
