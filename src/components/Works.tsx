import RevealText from './RevealText'
import WorkSlideCard from './WorkSlideCard'

// TODO: 実際の制作物に差し替える。image に完成ページのスクリーンショットのパスを
// 指定するとカードの画像部分に反映される（例: /images/works/project-01.jpg）。
// 未指定の間は「Coming soon」のプレースホルダーを表示する。
const WORKS: {
  no: string
  title: string
  color: string
  image?: string
  tags: string[]
}[] = [
  { no: '01', title: 'Project 01', color: '#7c93ac', image: undefined, tags: ['React', 'TypeScript'] },
  { no: '02', title: 'Project 02', color: '#8a7a63', image: undefined, tags: ['HTML', 'CSS', 'JavaScript'] },
  { no: '03', title: 'Project 03', color: '#3d4f6b', image: undefined, tags: ['React', 'Tailwind CSS'] },
]

// 継ぎ目なくループさせるため、カード列を2セット並べる
const TRACK = [...WORKS, ...WORKS]

export default function Works() {
  return (
    <section id="works" className="relative overflow-hidden bg-ink py-28 text-cream nav:py-[12vw]">
      <div className="layout-grid mb-16 nav:mb-[5vw]">
        <div className="col-span-6 nav:col-span-16">
          <div className="flex items-center gap-4">
            <span className="text-p-x text-cream/40">03</span>
            <span className="text-p-x tracking-[0.2em] text-cream/50">WORKS</span>
          </div>
          <h2 className="text-h2 mt-4 nav:mt-[1vw]">
            <RevealText text="つくったもの" />
          </h2>
        </div>
      </div>

      <div className="group overflow-hidden py-4 nav:py-[1vw]">
        <div className="animate-works-scroll flex w-max gap-14 nav:gap-[5vw]">
          {TRACK.map((work, i) => (
            <WorkSlideCard
              key={`${work.no}-${i}`}
              no={work.no}
              title={work.title}
              color={work.color}
              image={work.image}
              tags={work.tags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
