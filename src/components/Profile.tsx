import OrbitPanel from './OrbitPanel'
import RevealText from './RevealText'

export default function Profile() {
  return (
    <section id="profile" className="layout-grid bg-cream py-28 nav:py-[11vw]">
      <div className="col-span-6 nav:col-span-5">
        <div className="aspect-square overflow-hidden rounded-[0.6vw]">
          <OrbitPanel className="h-full w-full" />
        </div>
      </div>

      <div className="col-span-6 mt-10 flex flex-col gap-7 nav:col-span-9 nav:col-start-8 nav:mt-0 nav:gap-[2vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-ink/40">05</span>
          <span className="text-p-x tracking-[0.2em] text-ink/50">PROFILE</span>
        </div>
        <h2 className="text-h2">
          {/* TODO: 氏名に差し替える */}
          <RevealText text="Your Name" />
        </h2>
        <p className="text-h5 font-normal text-ink/60">Front-end Developer</p>
        <p className="text-p-l max-w-xl text-ink/70">
          {/* TODO: 人柄が伝わる自己紹介文に差し替える */}
          コツコツ積み上げることが得意です。分からないことは一つずつ丁寧に調べ、納得してから前に進むタイプ。
          静かに、でも着実に前進することを大切にしています。
        </p>
      </div>
    </section>
  )
}
