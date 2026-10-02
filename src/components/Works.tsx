import RevealText from './RevealText'
import WorkSlideCard from './WorkSlideCard'
import { useMarquee } from '../hooks/useMarquee'

// image に完成ページのスクリーンショットのパスを指定するとカードの画像部分に反映される
// （public/images/works/ に置く）。未指定の間は「Coming soon」のプレースホルダーを表示する。
// url（公開サイト）・repo（ソースコード）を指定すると、カードからそれぞれ別タブで開ける。
// notes には制作の経緯や期間などを短い箇条書きで入れる（タグの下に表示）。
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
    title: '接待〇✕ゲーム',
    color: '#7c93ac',
    image: '/images/works/tic-tac-toe-ai.webp',
    tags: ['HTML', 'CSS', 'JavaScript'],
    url: 'https://tic-tac-toe-ai-rho-gray.vercel.app/',
    repo: 'https://github.com/kresamtau908-png/tic-tac-toe-ai',
    notes: ['JavaScriptの練習のため制作', '制作期間：約3日'],
  },
  {
    no: '02',
    title: '天気情報アプリ',
    color: '#7c93ac',
    image: '/images/works/weather-app.webp',
    tags: ['TypeScript', 'Tailwind CSS', 'OpenWeather API'],
    url: 'https://kudo-weather-app.vercel.app',
    repo: 'https://github.com/kresamtau908-png/weather-app',
    notes: ['TypeScriptと外部APIの課題として制作', '制作期間：約1週間'],
  },
  {
    no: '03',
    title: 'ポケモン検索アプリ',
    color: '#7c93ac',
    image: '/images/works/pokemon-search.webp',
    tags: ['TypeScript', 'Tailwind CSS', 'PokeAPI'],
    url: 'https://pokemon-search-app-lake.vercel.app/',
    repo: 'https://github.com/kresamtau908-png/pokemon-search',
    notes: ['TypeScriptと外部APIの扱いを学ぶため、自主制作', '制作期間：約2週間'],
  },
]

// 継ぎ目なくループさせるため、カード列を複数セット並べる（1セット分ずれたら位置を戻す）。
// カードが少なくても、ループの切れ目で画面の右端に空白ができないよう4セット並べている
const TRACK = [...WORKS, ...WORKS, ...WORKS, ...WORKS]

export default function Works() {
  const { viewportRef, trackRef } = useMarquee(WORKS.length)

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

      {/* マウスを乗せたカードが拡大・浮き上がっても上下が切れないよう、上下に余白を取る。
          カードの上では減速して止まり、ドラッグ・スワイプで左右に動かせる（useMarquee）。
          touch-pan-y で、スマホの縦スクロールはそのままブラウザに任せる */}
      <div
        ref={viewportRef}
        className="touch-pan-y overflow-hidden py-8 select-none nav:cursor-grab nav:py-[2vw] data-dragging:nav:cursor-grabbing"
      >
        <div ref={trackRef} className="flex w-max gap-14 will-change-transform nav:gap-[5vw]">
          {TRACK.map((work, i) => (
            <div key={`${work.no}-${i}`} data-marquee-item className="shrink-0">
              <WorkSlideCard
                no={work.no}
                title={work.title}
                color={work.color}
                image={work.image}
                tags={work.tags}
                url={work.url}
                repo={work.repo}
                notes={work.notes}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
