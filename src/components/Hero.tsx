import HeroBlocks from './HeroBlocks'
import RevealText from './RevealText'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream pt-28 pb-20 nav:pt-[7vw]">
      <div className="layout-grid items-center">
        <div className="col-span-6 -mt-6 nav:col-span-8 nav:col-start-1 nav:mt-[-2.5vw]">
          <p className="text-p-x mb-6 tracking-[0.2em] text-lime nav:mb-[1.4vw]">FRONT-END DEVELOPER</p>
          <h1 className="text-h1">
            <RevealText text="Quiet Strength" className="block" />
          </h1>
          <p className="text-h4 mt-6 font-normal text-ink/70 nav:mt-[1.4vw]">
            <RevealText text="静かに積み重ねる" delay={0.15} />
          </p>
        </div>

        <div className="col-span-6 mt-14 hidden nav:col-span-7 nav:col-start-10 nav:mt-0 nav:block">
          <HeroBlocks rows={3} cols={3} className="aspect-square w-full" />
        </div>
      </div>
    </section>
  )
}
