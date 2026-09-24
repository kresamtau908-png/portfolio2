import RevealText from './RevealText'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col justify-between bg-cream pt-36 pb-20 nav:pt-[12vw]">
      <div className="layout-grid">
        <div className="col-span-6 nav:col-span-12 nav:col-start-3">
          <p className="text-p-x mb-6 tracking-[0.2em] text-lime nav:mb-[1.4vw]">
            FRONT-END DEVELOPER
          </p>
          <h1 className="text-h1">
            <RevealText text="Quiet Strength" className="block" />
          </h1>
          <p className="text-h4 mt-6 font-normal text-ink/70 nav:mt-[1.4vw]">
            <RevealText text="静かに、積み重ねる。" delay={0.15} />
          </p>
        </div>
      </div>

      <div className="layout-grid">
        <div className="col-span-6 flex items-center gap-4 nav:col-span-4">
          <span className="animate-line-grow h-px w-12 bg-ink/30" />
          <span className="text-p-x tracking-[0.2em] text-ink/50">SCROLL</span>
        </div>
      </div>
    </section>
  )
}
