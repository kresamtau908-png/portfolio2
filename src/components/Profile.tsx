import PersonalityPanel from './PersonalityPanel'
import RevealText from './RevealText'

export default function Profile() {
  return (
    <section id="profile" className="layout-grid bg-cream py-28 nav:py-[11vw]">
      <div className="col-span-6 nav:col-span-5">
        <div className="aspect-square overflow-hidden rounded-[0.6vw]">
          <PersonalityPanel className="h-full w-full" />
        </div>
      </div>

      <div className="col-span-6 mt-10 flex flex-col gap-7 nav:col-span-9 nav:col-start-8 nav:mt-0 nav:gap-[2vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-ink/40">05</span>
          <span className="text-p-x tracking-[0.2em] text-ink/50">PROFILE</span>
        </div>
        {/* 見出しはサイト全体に合わせてアルファベットで大きく出し、漢字とよみがなを下に小さく添える */}
        <div className="flex flex-col gap-2 nav:gap-[0.6vw]">
          <h2 className="text-h2">
            <RevealText text="Chihiro Kudo" />
          </h2>
          <p className="text-p-l text-ink/60">
            工藤 千拓<span className="ml-3 text-ink/40">くどう ちひろ</span>
          </p>
        </div>
        <p className="text-h5 font-normal text-ink/60">Front-end Developer</p>
        <p className="text-p-l max-w-xl text-ink/70">
          {/* TODO: 人柄が伝わる自己紹介文に差し替える */}
          コツコツ積み上げることが得意です 分からないことは一つずつ丁寧に調べ 納得してから前に進むタイプです
          着実に前進することを大切にしています
        </p>
      </div>
    </section>
  )
}
