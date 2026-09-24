import { useInView } from '../hooks/useInView'
import RevealText from './RevealText'
import WorkBadge from './WorkBadge'
import WorkNoteCard from './WorkNoteCard'

// TODO: 実際の制作物に差し替える。image に完成ページのスクリーンショットのパスを
// 指定するとバッジの「写真」部分に貼り付けられる（例: /images/works/project-01.jpg）。
// 未指定の間はプレースホルダーアイコンを表示する。
const WORKS: {
  no: string
  title: string
  color: string
  image?: string
  description: string
  tags: string[]
}[] = [
  {
    no: '01',
    title: 'Project 01',
    color: '#7c93ac',
    image: undefined,
    description: '現在制作中です。完成次第、制作の目的や工夫した点を掲載します。',
    tags: ['React', 'TypeScript'],
  },
  {
    no: '02',
    title: 'Project 02',
    color: '#8a7a63',
    image: undefined,
    description: '現在制作中です。完成次第、制作の目的や工夫した点を掲載します。',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    no: '03',
    title: 'Project 03',
    color: '#3d4f6b',
    image: undefined,
    description: '現在制作中です。完成次第、制作の目的や工夫した点を掲載します。',
    tags: ['React', 'Tailwind CSS'],
  },
]

function WorkRow({ work, index }: { work: (typeof WORKS)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)
  const reversed = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-10 nav:gap-[4vw] ${
        reversed ? 'nav:flex-row-reverse' : 'nav:flex-row'
      }`}
    >
      <div
        className="ease-brand shrink-0 transition-[transform,opacity] duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(2vw)',
        }}
      >
        <WorkBadge
          no={work.no}
          title={work.title}
          color={work.color}
          image={work.image}
          swayDelay={index * 0.6}
        />
      </div>

      <div
        className="ease-brand w-full max-w-sm transition-[transform,opacity] duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(2vw)',
          transitionDelay: inView ? '150ms' : '0ms',
        }}
      >
        <WorkNoteCard no={work.no} title={work.title} description={work.description} tags={work.tags} />
      </div>
    </div>
  )
}

export default function Works() {
  return (
    <section id="works" className="layout-grid relative overflow-hidden bg-ink py-28 text-cream nav:py-[12vw]">
      <div className="col-span-6 mb-16 nav:col-span-16 nav:mb-[5vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-cream/40">03</span>
          <span className="text-p-x tracking-[0.2em] text-cream/50">WORKS</span>
        </div>
        <h2 className="text-h2 mt-4 nav:mt-[1vw]">
          <RevealText text="つくったもの。" />
        </h2>
      </div>

      <div className="col-span-6 nav:col-span-16">
        <div className="flex flex-col gap-24 nav:gap-[8vw]">
          {WORKS.map((work, i) => (
            <WorkRow key={work.no} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
