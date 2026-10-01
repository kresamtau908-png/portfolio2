import RevealText from './RevealText'
import WorkSlideCard from './WorkSlideCard'

// image に完成ページのスクリーンショットのパスを指定するとカードの画像部分に反映される
// （public/images/works/ に置く）。未指定の間は「Coming soon」のプレースホルダーを表示する。
// url（公開サイト）・repo（ソースコード）を指定すると、カードからそれぞれ別タブで開ける。
// notes には制作の経緯や期間などを短い箇条書きで入れる（タグの下に表示）。
// TODO: Project 02・03 を実際の制作物に差し替える
const WORKS: {
  no: string
  title: string
  color: string
  image?: string
  tags: string[]
  url?: string
  repo?: string
  notes?: string[]
}[] = [
  {
    no: '01',
    title: 'ポケモン検索アプリ',
    color: '#7c93ac',
    image: '/images/works/pokemon-search.webp',
    tags: ['TypeScript', 'Tailwind CSS', 'PokeAPI'],
    url: 'https://pokemon-search-app-lake.vercel.app/',
    repo: 'https://github.com/kresamtau908-png/pokemon-search',
    notes: ['TypeScriptと外部APIの扱いを学ぶため、自主制作', '制作期間：約2週間'],
  },
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
            <RevealText text="Selected Works" />
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
              url={work.url}
              repo={work.repo}
              notes={work.notes}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
