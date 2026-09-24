import GeometricPanel from './GeometricPanel'
import RevealText from './RevealText'

export default function About() {
  return (
    <section id="about" className="layout-grid bg-cream py-28 nav:py-[11vw]">
      <div className="order-2 col-span-6 flex flex-col gap-8 nav:order-1 nav:col-span-7 nav:gap-[2.2vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-ink/40">01</span>
          <span className="text-p-x tracking-[0.2em] text-ink/50">ABOUT</span>
        </div>
        <h2 className="text-h2">
          <RevealText text="異業種から" className="block" />
          <RevealText text="フロントエンドの世界へ" className="block" delay={0.1} />
        </h2>
        <p className="text-p-l max-w-xl text-ink/70">
          Webとは関わりのない仕事からフロントエンドエンジニアを目指してキャリアチェンジしました
        </p>
        <p className="text-p-l max-w-xl border-l-2 border-lime pl-5 text-ink/70">
          退職後は「フロントエンドエンジニア養成科」で半年間学び現在は卒業を控えながら実践としてこのポートフォリオサイトを制作しています
        </p>
      </div>

      <div className="order-1 col-span-6 mb-10 nav:order-2 nav:col-span-8 nav:col-start-9 nav:mb-0">
        <div className="aspect-662/763 overflow-hidden rounded-[0.6vw]">
          <GeometricPanel className="h-full w-full" />
        </div>
      </div>
    </section>
  )
}
