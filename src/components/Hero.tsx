import HeroBackground from './HeroBackground'
import RevealText from './RevealText'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-cream pt-36 pb-20 nav:pt-[12vw]">
      <HeroBackground />

      <div className="layout-grid">
        <div className="col-span-6 nav:col-span-12 nav:col-start-3">
          <p className="text-p-x mb-6 tracking-[0.2em] text-lime nav:mb-[1.4vw]">
            FRONT-END DEVELOPER
          </p>
          <h1 className="text-h1">
            <RevealText text="Quiet Strength" className="block" />
          </h1>
          <p className="text-h4 mt-6 font-normal text-ink/70 nav:mt-[1.4vw]">
            <RevealText text="静かに積み重ねる" delay={0.15} />
          </p>
        </div>
      </div>
    </section>
  )
}
